const path = require("path");
const fs = require("fs");
let currentDirname = path.dirname(__filename);
let pathCurrentFolder = path.join(__dirname, "files");
let pathOfCopy = path.join(__dirname, "files-copy");

fs.access(pathOfCopy, function (error) {
  if (error) {
    fs.mkdir(path.join(currentDirname, "files-copy"), (err) => {
      if (err) throw err;
    });
  } else {
    fs.readdir(pathOfCopy, (err, files) => {
      //clean folder it it exists
      if (err) throw err;
      for (const file of files) {
        const fullPath = path.join(pathOfCopy, file);
        fs.lstat(fullPath, (err, file) => {
          if (err) throw err;
          if (file.isDirectory()) {
            fs.rmdir(fullPath, (err) => {
              if (err) throw err;
            });
          } else {
            fs.unlink(fullPath, (err) => {
              if (err) throw err;
            });
          }
        });
      }
    });
  }
});

function copyDir(src, dest) {
  fs.readdir(src, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const filePath = path.join(src, file);
      fs.lstat(filePath, (err, stats) => {
        if (err) return console.log(err);
        if (stats.isDirectory()) {
          let currentPath = path.join(src, file);
          let destPath = path.join(dest, file);
          fs.mkdir(destPath, (err) => {
            if (err) throw err;
          });
          copyDir(currentPath, destPath);
        } else {
          let currentPath = path.join(src, file);
          let destPath = path.join(dest, file);
          fs.copyFile(currentPath, destPath, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
}

copyDir(pathCurrentFolder, pathOfCopy);

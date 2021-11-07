const path = require("path");
const fs = require("fs");
let currentDirname = path.dirname(__filename);
let pathCurrentFolder = path.join(__dirname, "files");
let pathOfCopy = path.join(__dirname, "files-copy");

const listPromise = [];
new Promise((resolve, reject) => {
  fs.access(pathOfCopy, function (error) {
    if (error) {
      fs.mkdir(path.join(currentDirname, "files-copy"), (err) => {
        resolve();
        if (err) throw err;
      });
    } else {
      fs.readdir(pathOfCopy, (err, files) => {
        //clean folder it it exists
        if (err) throw err;
        for (const file of files) {
          const fullPath = path.join(pathOfCopy, file);
          listPromise.push(
            new Promise((resolve, reject) => {
              fs.lstat(fullPath, (err, file) => {
                if (err) {
                  reject();
                  throw err;
                }

                if (file.isDirectory()) {
                  fs.rmdir(fullPath, { recursive: true }, (err) => {
                    if (err) {
                      reject();
                      throw err;
                    } else {
                      resolve();
                    }
                  });
                } else {
                  fs.unlink(fullPath, (err) => {
                    if (err) {
                      reject();
                      throw err;
                    } else {
                      resolve();
                    }
                  });
                }
              });
            })
          );
        }

        resolve();
      });
    }
  });
}).then(() => {
  Promise.all(listPromise).then(() => copyDir(pathCurrentFolder, pathOfCopy));
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

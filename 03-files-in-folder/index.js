const path = require("path");
const fs = require("fs");
let currentDirname = path.dirname(__filename);
let fileName = path.basename(__filename);
let pathToSF = path.join(currentDirname, "secret-folder");

fs.readdir(pathToSF, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach((file) => {
    let currentPath = path.join(currentDirname, "secret-folder", file);
    fs.lstat(currentPath, (err, stats) => {
      if (err) return console.log(err); //Handle error
      if (stats.isFile()) {
        let fileNameWithoutExt = file.replace(/\.[^/.]+$/, "");
        //extention
        function getExtension(file) {
          let i = file.lastIndexOf(".");
          return i < 0 ? "" : file.substr(i + 1);
        }
        let fileExt = getExtension(file);
        let fileSize = Math.round((stats.size / 1024) * 1000) / 1000;
        console.log(`${fileNameWithoutExt} - ${fileExt} - ${fileSize}Kb`);
      }
    });
  });
});

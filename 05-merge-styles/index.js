const path = require("path");
const fs = require("fs");
const { stdin, stdout } = process;
let pathOfStyles = path.join(__dirname, "styles");
let stylesData = "";

//создан файл
fs.writeFile(path.join(__dirname, "project-dist", "bundle.css"), "", (err) => {
  if (err) throw err;
});
let bundlePath = path.join(__dirname, "project-dist", "bundle.css");
//работаем со списком стилей
fs.readdir(pathOfStyles, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach((file) => {
    let currentPath = path.join(pathOfStyles, file);
    let fileExtension = path.extname(file);
    if (fileExtension === ".css") {
      fs.readFile(currentPath, "utf-8", (err, data) => {
        if (err) throw err;
        stylesData += data;
        fs.appendFile(bundlePath, data, (err) => {
          if (err) throw err;
        });
      });
    }
  });
});

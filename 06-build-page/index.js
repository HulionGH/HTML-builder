const path = require("path");
const fs = require("fs");
const listPromise = [];
const destPath = path.join(__dirname, "project-dist");
let stylesData = "";
let templateHtml = "";

fs.mkdir(path.join(__dirname, "project-dist"), (err) => {
  if (err) throw err;
});
let currentDirname = path.dirname(__filename);
//copy dir ASSETS
let pathCurrentFolder = path.join(__dirname, "assets");
let pathOfCopy = path.join(__dirname, "project-dist", "assets");
new Promise((resolve, reject) => {
  fs.access(pathOfCopy, function (error) {
    if (error) {
      fs.mkdir(path.join(currentDirname, "project-dist", "assets"), (err) => {
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
  Promise.all(listPromise).then(() => {
    copyDir(pathCurrentFolder, pathOfCopy);
    bundleStyles();
    rewriteAndCopyIndex();
    console.log("the End");
  });
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

function bundleStyles() {
  fs.writeFile(path.join(__dirname, "project-dist", "style.css"), "", (err) => {
    if (err) throw err;
  });
  let bundlePath = path.join(__dirname, "project-dist", "style.css");
  let pathOfStyles = path.join(__dirname, "styles");
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
}

function rewriteAndCopyIndex() {
  fs.writeFile(
    path.join(__dirname, "project-dist", "index.html"),
    "",
    (err) => {
      if (err) throw err;
    }
  );
  let bundlePath = path.join(__dirname, "project-dist", "index.html");
  let templatePath = path.join(__dirname, "template.html");
  loadComponents().then((loadedComponents) => {
    fs.readFile(templatePath, "utf-8", (err, data) => {
      if (err) throw err;
      templateHtml += regexConvertTag(data, loadedComponents);
      fs.appendFile(bundlePath, templateHtml, (err) => {
        if (err) throw err;
      });
    });
  });
}

function regexConvertTag(input, loadedComponents) {
  let matchedTags = input.match(/\{\{(.*?)\}\}/g);
  matchedTags.forEach((tagExpr) => {
    const tagName = tagExpr.replace(/\{\{|\}\}/g, "");
    input = input.replace(
      tagExpr,
      loadedComponents[tagName] || `<${tagName}></${tagName}>`
    );
  });
  return input;
}

function loadComponents() {
  return new Promise((resolveLoadedComponents, reject) => {
    let pathToComponents = path.join(__dirname, "components");
    let componentsObj = {};

    fs.readdir(pathToComponents, (err, files) => {
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      let listOfPromises = [];
      files.forEach((file) => {
        let currentPath = path.join(pathToComponents, file);
        listOfPromises.push(
          new Promise((resolve, reject) => {
            fs.lstat(currentPath, (err, stats) => {
              if (err) {
                reject();
                return console.log(err);
              }
              if (stats.isFile()) {
                let fileNameWithoutExt = file.replace(/\.[^/.]+$/, "");
                fs.readFile(currentPath, "utf-8", (err, data) => {
                  if (err) {
                    throw err;
                    reject();
                  }
                  componentsObj[fileNameWithoutExt] = data;
                  resolve();
                });
              }
            });
          })
        );
      });

      Promise.all(listOfPromises).then(() =>
        resolveLoadedComponents(componentsObj)
      );
    });
  });
}

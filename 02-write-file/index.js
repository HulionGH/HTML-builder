const path = require("path");
const fs = require("fs");
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });

fs.writeFile(path.join(__dirname, "mynotes.txt"), "", (err) => {
  if (err) throw err;
});
let filePath = path.join(__dirname, "mynotes.txt");

const writeStream = fs.createWriteStream(filePath);
output.write(
  "Введите, пожалуйста, текст в консоль и нажмите Enter для записи! Ctrl+C или exit - чтобы завершить запись\n"
);

/*stdin.on("data", (data) => {
  const dataStringified = data.toString();
  if (dataStringified.slice(0, -2) === "exit") {
    stdout.write("\nЗапись завершена!");
    process.exit();
  }
  writeStream.write(dataStringified.replaceAll("exit", ""));
});*/

rl.on("line", (data) => {
  const dataStringified = data.toString();
  let result = dataStringified;
  if (dataStringified.includes("exit")) {
    result = dataStringified.replace(/exit/g, "");
    output.write("\nЗапись завершена!");
    process.exit();
  }
  writeStream.write(result);
});

rl.on("SIGINT", () => {
  output.write("\nЗапись завершена!");
  process.exit();
});

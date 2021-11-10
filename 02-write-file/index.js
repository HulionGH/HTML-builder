const path = require("path");
const fs = require("fs");
const { stdin, stdout } = process;
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });

fs.writeFile(path.join(__dirname, "mynotes.txt"), "", (err) => {
  if (err) throw err;
});
let filePath = path.join(__dirname, "mynotes.txt");

const writeStream = fs.createWriteStream(filePath);
stdout.write(
  "Введите, пожалуйста, текст в консоль и нажмите Enter для записи! Ctrl+C или exit - чтобы завершить запись\n"
);

rl.on("line", (data) => {
  const dataStringified = data.toString();
  if (dataStringified === "exit") {
    stdout.write("\nЗапись завершена!");
    process.exit();
  }
  writeStream.write(dataStringified);
});

rl.on("SIGINT", () => {
  stdout.write("\nЗапись завершена!");
  process.exit();
});

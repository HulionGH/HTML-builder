const path = require("path");
const fs = require("fs");
const { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, "mynotes.txt"), "", (err) => {
  if (err) throw err;
});
let filePath = path.join(__dirname, "mynotes.txt");

const output = fs.createWriteStream(filePath);
stdout.write(
  "Введите, пожалуйста, текст в консоль и нажмите Enter для записи! Ctrl+C или exit - чтобы завершить запись\n"
);

stdin.on("data", (data) => {
  const dataStringified = data.toString();
  if (dataStringified.slice(0, -2) === "exit") {
    stdout.write("\nЗапись завершена!");
    process.exit();
  }
  output.write(dataStringified);
});

process.on("SIGINT", () => {
  stdout.write("\nЗапись завершена!");
  process.exit();
});

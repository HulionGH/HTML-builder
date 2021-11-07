const path = require("path");
let filePath = path.join(__dirname, "text.txt");

const fs = require("fs");
const readableStream = fs.createReadStream(filePath, "utf-8");
let data = "";
readableStream.on("data", (chunk) => (data += chunk));
readableStream.on("end", () => console.log(data));
readableStream.on("error", (error) => console.log("Error", error.message));

// インポート
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");

// 定数
const fileNames = ["matter", "vertices", "rank", "effect", "game", "window", "loader", "audio"];

// ファイル読込み
let allScript = "";
fileNames.forEach((fileName) => {
    allScript += fs.readFileSync(`../../src/${fileName}.js`, "utf-8");
});

// 難読化
const obfuscationResult = JavaScriptObfuscator.obfuscate(allScript, {
    stringArray: true,
    transformObjectKeys: true,
});

// 書き込み
fs.writeFileSync("../../script.js", obfuscationResult.getObfuscatedCode());
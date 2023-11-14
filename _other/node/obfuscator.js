// インポート
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");

// 定数
const fileNames = ["matter", "vertices", "rank", "effect", "game", "window", "loader", "audio"];

// ファイル読込み
let allScript = "";
fileNames.forEach((fileName) => {
    allScript += fs.readFileSync(`../../_src/${fileName}.js`, "utf-8");
});

// 難読化
const obfuscationResult = JavaScriptObfuscator.obfuscate(allScript, {
    debugProtection: false,  // あとでTrue
    renameGlobals: true,
    stringArray: true,
    stringArrayWrappersCount: 3,
    transformObjectKeys: true,
});

// 書き込み
fs.writeFileSync("../../script.js", obfuscationResult.getObfuscatedCode());
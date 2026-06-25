import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const args = Bun.argv.slice(2);
main(args);

async function main(args: string[]) {
  if (args.length === 0) {
    console.log("usage: cfg2env <dir>");
    return;
  }

  const inputDir = args[0]!;
  if (!fs.existsSync(inputDir)) {
    console.log(`'${inputDir}' not exists`);
    return;
  }

  const filePaths = fs.globSync("HISServer_*/appsettings.exe.config", {
    cwd: inputDir,
  });

  for (const filePath of filePaths) {
    const fullPath = path.resolve(inputDir, filePath);
    const bunfile = Bun.file(fullPath);
    const xmlStr = await bunfile.text();

    const parser = new XMLParser({ ignoreAttributes: false });
    const obj = parser.parse(xmlStr)["configuration"];

    const config = new Map();

    (obj["connectionStrings"]["add"] as any[]).forEach((item) => {
      config.set(item["@_name"], item["@_connectionString"]);
    });

    (obj["appSettings"]["add"] as any[]).forEach((item) => {
      config.set(item["@_key"], item["@_value"]);
    });

    let envStr = "";
    for (const [key, value] of config) {
      if (/=| /.test(value)) {
        envStr += `${key}="${value}"\n`;
      } else {
        envStr += `${key}=${value}\n`;
      }
    }

    const envFilePath = path.resolve(path.dirname(fullPath), ".env");
    await Bun.write(envFilePath, envStr);
    console.log(envFilePath, "ok");
  }
}

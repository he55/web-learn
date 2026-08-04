import path from "node:path";
import fs from "node:fs";
import { $, env } from "bun";
import { JSDOM } from "jsdom";
import sql from "mssql";

declare module "bun" {
  interface Env {
    SQL_SERVER: string;
  }
}

async function convertHtml(docpath: string, id: number) {
  try {
    await $`"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --convert-to html ${docpath} --outdir output/${id}`.quiet();
  } catch {}

  const [htmlfile] = fs.globSync(`output/${id}/*.html`);
  if (htmlfile) {
    const html = fs.readFileSync(htmlfile, "utf8");
    const dom = new JSDOM(html);
    let str = dom.window.document.body.innerHTML;

    const files = fs
      .readdirSync(`output/${id}`)
      .filter((x) => x.endsWith(".jpg") || x.endsWith(".png"));
    for (const fp of files) {
      str = str.replaceAll(fp, `[BASE]/${id}/${fp}`);
    }
    return str;
  }
}

async function main() {
  const inputDir = "F:\\SynologyDrive\\documents";

  await sql.connect(env.SQL_SERVER);

  for (let i = 14430; i < 14440; i++) {
    const subdir = path.resolve(inputDir, i.toString(), "docs");
    if (fs.existsSync(subdir)) {
      const files = fs.globSync("*.docx", { cwd: subdir });
      const doc = files.sort().at(-1);
      if (doc) {
        const docpath = path.resolve(subdir, doc);

        const html = await convertHtml(docpath, i);
        continue;
        if (html) {
          await sql.query`INSERT INTO [D_Document]([PatientNumber],[HTML],[Type]) VALUES(${i},${html},2)`;
          console.log("save ok.", i);
        } else {
          console.log("save fail.", i);
        }
      }
    }
  }

  process.exit();
}

main();

import { env, argv } from "bun";
import fs from "node:fs";
import path from "node:path";
import sql from "mssql";

declare module "bun" {
  interface Env {
    SQL_SERVER: string;
  }
}

await main(argv.slice(2));

async function main(arg: string[]) {
  if (arg.length < 2) {
    throw new Error("arguments error");
  }

  const [org, filepath] = arg;
  const bunfile = Bun.file(filepath!);
  if (!(await bunfile.exists())) {
    throw new Error(`${filepath} is not exists`);
  }

  const text = await bunfile.text();
  const arr = text.split("\r\n");

  await sql.connect(env.SQL_SERVER);
  const res =
    await sql.query`SELECT pid,patient_id FROM [RE_Patient] where org=${org}`;

  let cmd = "";
  const len = arr.length;

  for (let i = 0; i < len; i++) {
    const str = arr[i]!;

    const [name, , id, time, sex, age, , doctor, status] = str.split(",");
    if (name === "病人姓名") {
      continue;
    }

    const patient_id = parseInt(id!);
    const item = res.recordset.find((v) => v.patient_id === patient_id);
    if (!item) {
      continue;
    }

    const src = path.resolve("F:\\Data\\recording\\sounds", org!, item.pid);
    if (!fs.existsSync(src)) {
      continue;
    }

    const a = status === "否" ? "成交" : "流失";
    const folder = `${patient_id}_${name}_${sex}_${age}_${doctor}_${time}_${a}`;
    console.log(`[${i + 1}/${len}] ${folder}`);

    const dest = path.resolve("E:\\Data", org!, folder);
    cmd += `xcopy /Y /E /C ${src} ${dest}\\ \r\n`;
  }

  cmd += "pause";

  fs.writeFileSync(`data/${org}-cp.cmd`, cmd);
  console.log("done");
  process.exit();
}

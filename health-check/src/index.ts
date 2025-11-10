import { sleep } from "bun";
import services from "../services.json";
import { sendHttp, sendTcp } from "./helper";
import type { Config } from "./types";

const configs: readonly Config[] = services.map((x) => ({
  type: x.type,
  name: x.name,
  url: x.url,
  lastDate: Date.now(),
}));

async function func() {
  for (const config of configs) {
    await sleep(1_000);
    let result: unknown = "unknown";

    try {
      if (config.type === "tcp") {
        result = await sendTcp(config.url);
      } else if (config.type === "http") {
        result = await sendHttp(config.url);
      }
      config.lastDate = Date.now();
    } catch (error) {
      result = error;
    }

    console.log(new Date().toLocaleString(), config.name, result);
  }

  console.log("----------------------------------");
  setTimeout(func, 15000);
}

async function func2() {
  const now = Date.now();
  const list = configs.filter((x) => now - x.lastDate > 60_000);
  if (!list.length) {
    return;
  }

  const str = list
    .map((x) => {
      const minutes = Math.trunc((now - x.lastDate) / 60_000);
      return `- ${x.name} 不可用 (${minutes} 分钟)`;
    })
    .join("\n");
  const msg = `## 服务异常通知!\n${str}`;
  console.log(msg);
}

async function main() {
  setInterval(func2, 70_000);
  func();
}

main();

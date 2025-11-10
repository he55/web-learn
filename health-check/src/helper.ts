import { connect } from "bun";
import { decodeString } from "./utils";

export async function sendHttp(url: string) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    throw new Error("status code not success");
  }

  const text = await res.text();
  return text;
}

type UserData = {
  length: number;
  receivedBytes: number;
  buffers: Buffer[];
};

const buf1 = Uint8Array.fromBase64(
  "Lk5FVAEAAAAAAHMAAAAEAAEBKQAAAHRjcDovL2hpcy5uamJzYmRmLmNvbTo5MDg5L0lIZWFsdGhTZXJ2aWNlBgABARgAAABhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0AAA=="
);
const buf2 = Uint8Array.fromBase64(
  "AAAAAAAAAAAAAQAAAAAAAAAVEQAAABIEUGluZxJUSElTQXBpLklIZWFsdGhTZXJ2aWNlLCBISVNBcGksIFZlcnNpb249MS4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1udWxsCw=="
);

export async function sendTcp(url: string) {
  const [host, port] = url.split(":");

  const { promise, resolve, reject } = Promise.withResolvers<string>();

  const socket = await connect<UserData>({
    hostname: host!,
    port: Number(port),
    data: { length: 0, receivedBytes: 0, buffers: [] },

    socket: {
      data(socket, data) {
        // console.log("data");

        const udata = socket.data;
        udata.receivedBytes += data.length;
        udata.buffers.push(data);

        if (!udata.length) {
          udata.length = data.readInt16LE(0xa) + 16;
        }

        if (udata.receivedBytes >= 16 && udata.receivedBytes >= udata.length) {
          const newBuf = Buffer.concat(udata.buffers);
          const str = decodeString(newBuf, 0x27);
          resolve(str);
          socket.close();
        }
      },
      open(socket) {
        // console.log("open");
        socket.write(buf1);
        socket.write(buf2);
      },
      close(socket, error) {
        // console.log("close");
      },
      drain(socket) {},
      error(socket, error) {
        console.log("error");
        reject(error);
      },

      // client-specific handlers
      connectError(socket, error) {}, // connection failed
      end(socket) {
        console.log("end");
      }, // connection closed by server
      timeout(socket) {
        reject(new Error("timeout"));
      }, // connection timed out
    },
  });

  socket.timeout(8);

  return promise;
}

export async function sendDingMsg(msg: string) {
  const url =
    "https://oapi.dingtalk.com/robot/send?access_token=a4703ae27e4d0ae87c7d36392929c1567bdff1f7ea94adfed1ca593421d7bb6a";

  const content = {
    msgtype: "markdown",
    markdown: {
      title: "服务异常通知",
      text: msg,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    throw new Error("status code not success");
  }

  const result = res.text();
  console.log(result);
}

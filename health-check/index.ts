import { connect, sleep } from "bun";
import services from "./services.json";

type Service = {
  type: string;
  name: string;
  address: string;
};

main();

async function main() {
  for (const element of services) {
    try {
      if (element.type === "tcp") {
        const result = await sendTcp(element);
        console.log(result.toString());
      } else if (element.type === "http") {
        await sendHttp(element);
      }
    } catch (error) {
      console.log(error);
    }
    await sleep(3_000);
  }
}

async function sendHttp(service: Service) {
  const res = await fetch(service.address);
  const text = await res.text();
  console.log(service.name, ":", text);
}

const buf1 = Uint8Array.fromBase64(
  "Lk5FVAEAAAAAAHMAAAAEAAEBKQAAAHRjcDovL2hpcy5uamJzYmRmLmNvbTo5MDg5L0lIZWFsdGhTZXJ2aWNlBgABARgAAABhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0AAA=="
);
const buf2 = Uint8Array.fromBase64(
  "AAAAAAAAAAAAAQAAAAAAAAAVEQAAABIEUGluZxJUSElTQXBpLklIZWFsdGhTZXJ2aWNlLCBISVNBcGksIFZlcnNpb249MS4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1udWxsCw=="
);

async function sendTcp(service: Service) {
  const [host, port] = service.address.split(":");

  const { promise, resolve, reject } = Promise.withResolvers<Buffer>();

  const socket = await connect({
    hostname: host!,
    port: Number(port),

    socket: {
      data(socket, data) {
        console.log("data");
        resolve(data);
        socket.close();
      },
      open(socket) {
        console.log("open");
        socket.write(buf1);
        socket.write(buf2);
      },
      close(socket, error) {
        console.log("close");
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
        console.log("timeout");
        reject(new Error("timeout"));
      }, // connection timed out
    },
  });

  socket.timeout(8_000);

  return promise;
}

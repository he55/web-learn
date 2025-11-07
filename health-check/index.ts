import { connect, sleep } from "bun";
import services from "./services.json";

type Service = {
  type: string;
  name: string;
  address: string;
};

for (const element of services) {
  if (element.type === "tcp") {
    await sendTcp(element);
    await sleep(3_000)
  } else if (element.type === "http") {
    await sendHttp(element);
  }
  // break;
}

async function sendHttp(service: Service) {
  const res = await fetch(service.address);
  const text = await res.text();
  console.log(service.name, ":", text);
}

async function sendTcp(service: Service) {
  const [host, port] = service.address.split(":");

  const socket = await connect({
    hostname: host!,
    port: Number(port),

    socket: {
      data(socket, data) {
        console.log(data);
        console.log(data.toString())
        // socket.close()
      },
      open(socket) {
        console.log("open");
      },
      close(socket, error) {
        console.log("close");
      },
      drain(socket) {},
      error(socket, error) {},

      // client-specific handlers
      connectError(socket, error) {}, // connection failed
      end(socket) {}, // connection closed by server
      timeout(socket) {}, // connection timed out
    },
  });

  socket.write(
    Uint8Array.fromBase64(
      "Lk5FVAEAAAAAAHMAAAAEAAEBKQAAAHRjcDovL2hpcy5uamJzYmRmLmNvbTo5MDg5L0lIZWFsdGhTZXJ2aWNlBgABARgAAABhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0AAA=="
    )
  );
  socket.write(
    Uint8Array.fromBase64(
      "AAAAAAAAAAAAAQAAAAAAAAAVEQAAABIEUGluZxJUSElTQXBpLklIZWFsdGhTZXJ2aWNlLCBISVNBcGksIFZlcnNpb249MS4wLjAuMCwgQ3VsdHVyZT1uZXV0cmFsLCBQdWJsaWNLZXlUb2tlbj1udWxsCw=="
    )
  );
}

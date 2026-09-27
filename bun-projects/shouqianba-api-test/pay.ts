import { sign } from "./utils";

const vendor_sn = "91804135";
const vendor_key = "3e5f9068155459639c7c337ffb1cb515";
const appid = "2026091700013187";
const code = "05127988";
const device_id = "ZARA001P013456732";

const baseUrl = "https://vsi-api.shouqianba.com";
const terminal_sn = "100131870058381227";
const terminal_key = "34d162f2d635445dfb848a13a500944b";

const notify_url =
  "http://his.njbsbdf.com:10011/api/v2/payment2/shouqianba-pay/msg-notify";

type QRCode = {
  qr_code: string;
  qr_code_image_url: string;
};

export type OrderDetail = {
  sn: string;
  tsn: string;
  type: string;
  client_sn: string;
  client_tsn: string;
  ctime: string;
  status: string;
  payway: string;
  payway_name: string;
  sub_payway: string;
  order_status: string;
  payer_login: string;
  payer_uid: string;
  trade_no: string;
  channel_trade_no: string;
  total_amount: string;
  net_amount: string;
  settlement_amount: string;
  finish_time: string;
  channel_finish_time: string;
  subject: string;
  store_id: string;
  terminal_id: string;
  operator: string;
  payment_list: {
    type: string;
    amount_total: string;
    amount: string;
  }[];
};

type ApiResult<T> = {
  result_code: string;
  biz_response: {
    result_code: string;
    data: T;
  };
};

export type PayRequestVo = {
  payMerTranNo: string;
  totalAmount: string;
};

type PayUrlDto = {
  payMerTranNo: string;
  displayCodeText: string;
};

type PayMessage = {
  merTranNo: string;
  finalTime: string;
  tranState: string;
  totalAmount: string;
  buyerPayAmount: string;
};

export function toMessage(data?: OrderDetail): PayMessage {
  let msg: PayMessage = {
    merTranNo: "",
    finalTime: "",
    tranState: "Unknown",
    totalAmount: "",
    buyerPayAmount: "",
  };

  if (data?.order_status !== "PAID") {
    return msg;
  }

  const { client_sn, finish_time, total_amount } = data;

  msg.merTranNo = client_sn;
  msg.finalTime = new Date(parseInt(finish_time))
    .toISOString()
    .substring(0, 19)
    .replaceAll(/[-T:]/g, "");
  msg.tranState = "PAIED";
  msg.buyerPayAmount = msg.totalAmount = (
    parseFloat(total_amount) / 100
  ).toFixed(2);

  return msg;
}

export async function activate() {
  const data = {
    app_id: appid,
    code: code,
    device_id: device_id,
  };

  const payload = JSON.stringify(data);
  const auth = sign(payload + vendor_key, vendor_sn);

  const res = await fetch(baseUrl + "/terminal/activate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: auth,
    },
    body: payload,
  });

  const result = await res.json();
  return result;
}

export async function checkin() {
  const data = {
    device_id: device_id,
    terminal_sn: terminal_sn,
  };

  const payload = JSON.stringify(data);
  const auth = sign(payload + terminal_key, terminal_sn);

  const res = await fetch(baseUrl + "/terminal/checkin", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: auth,
    },
    body: payload,
  });

  const result = await res.json();
  return result;
}

export async function createOrder(vo: PayRequestVo): Promise<PayUrlDto> {
  const data = {
    client_sn: vo.payMerTranNo,
    operator: "admin",
    subject: "医院收费",
    total_amount: (parseFloat(vo.totalAmount) * 100).toFixed(0),
    terminal_sn: terminal_sn,
    notify_url: notify_url,
  };

  const payload = JSON.stringify(data);
  const auth = sign(payload + terminal_key, terminal_sn);

  const res = await fetch(baseUrl + "/upay/support/precreateQrcode", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: auth,
    },
    body: payload,
  });

  const result = (await res.json()) as ApiResult<QRCode>;

  const qr_code = result.biz_response?.data?.qr_code;
  if (!qr_code) {
    throw new Error("api err");
  }

  return {
    payMerTranNo: vo.payMerTranNo,
    displayCodeText: qr_code,
  };
}

export async function queryOrder(orderId: string): Promise<PayMessage> {
  const data = {
    client_sn: orderId,
    terminal_sn: terminal_sn,
  };

  const payload = JSON.stringify(data);
  const auth = sign(payload + terminal_key, terminal_sn);

  const resp = await fetch(baseUrl + "/upay/v2/query", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: auth,
    },
    body: payload,
  });

  const result = (await resp.json()) as ApiResult<OrderDetail>;

  return toMessage(result.biz_response?.data);
}

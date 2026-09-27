import { md5 } from "../utils";

type Type1 = {
  SUCCESS: string;
  PAYURL: string;
};

type Type2 = {
  SUCCESS: string;
  QRURL: string;
};

const bankURL = "https://ibsbjstar.ccb.com.cn/CCBIS/ccbMain";

const MERCHANTID = "105000080712132";
const POSID = "106207557";
const BRANCHID = "520000000";
const ORDERID = "2026090700028";
const PAYMENT = "0.01";
const CURCODE = "01";
const TXCODE = "530550";
const REMARK1 = "";
const REMARK2 = "";
const RETURNTYPE = "3";
const TIMEOUT = "";
const PUB32TR2 = "8989ace4ee9afb04569cf01b020111";

let tmp = "";
tmp += "MERCHANTID=";
tmp += MERCHANTID;
tmp += "&POSID=";
tmp += POSID;
tmp += "&BRANCHID=";
tmp += BRANCHID;
tmp += "&ORDERID=";
tmp += ORDERID;
tmp += "&PAYMENT=";
tmp += PAYMENT;
tmp += "&CURCODE=";
tmp += CURCODE;
tmp += "&TXCODE=";
tmp += TXCODE;
tmp += "&REMARK1=";
tmp += REMARK1;
tmp += "&REMARK2=";
tmp += REMARK2;
tmp += "&RETURNTYPE=";
tmp += RETURNTYPE;
tmp += "&TIMEOUT=";
tmp += TIMEOUT;
tmp += "&PUB=";
tmp += PUB32TR2;

const payload = new URLSearchParams({
  CCB_IBSVersion: "V6",
  MERCHANTID: MERCHANTID,
  BRANCHID: BRANCHID,
  POSID: POSID,
  ORDERID: ORDERID,
  PAYMENT: PAYMENT,
  CURCODE: CURCODE,
  TXCODE: TXCODE,
  REMARK1: REMARK1,
  REMARK2: REMARK2,
  RETURNTYPE: RETURNTYPE,
  TIMEOUT: TIMEOUT,
  MAC: md5(tmp),
});

const res = await fetch(bankURL, {
  method: "POST",
  body: payload,
});

const result = (await res.json()) as Type1;
if (result.SUCCESS !== "true") {
  throw new Error("err api1");
}

const res2 = await fetch(result.PAYURL);
const a = (await res2.json()) as Type2;
if (a.SUCCESS !== "true") {
  throw new Error("err api2");
}

const qr_url = decodeURIComponent(a.QRURL);
console.log(qr_url);

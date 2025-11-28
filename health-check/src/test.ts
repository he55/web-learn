import { sendTcp2 } from "./helper";

console.log('send tcp');

const val = await sendTcp2('his.njbsbdf.com:908')
console.log(val);


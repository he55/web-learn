import fs from 'node:fs'
import crypto from 'node:crypto'
import dayjs from 'dayjs'

const appid = 'OP00000003'
const serial_no = '00dfba8194c41b84cf'
const merchant_no = '822290059430BFA'
const term_no = 'D9261078'

const datetime = dayjs().format('YYYYMMDDHHmmss')
let obj = {
  version: '3.0',
  req_time: datetime,
  req_data: {
    merchant_no: merchant_no,
    term_no: term_no,
    out_trade_no: `A${datetime}`,
    auth_code: '134378466040328810',
    total_amount: '1',
    location_info: {
      request_ip: '36.45.36.95',
      location: '+31.221345,+121.12345',
    },
    subject: '支付测试',
    notify_url: '',
  },
}

const body2 = JSON.stringify(obj)


obj = {
  req_data: {
    out_order_no: `A${datetime}`,
    merchant_no: merchant_no,
    vpos_id: '',
    channel_id: '',
    total_amount: '1',
    order_efficient_time: '20250730170009',
    notify_url: '',
    support_cancel: '0',
    support_refund: '1',
    support_repeat_pay: '1',
    busi_type_param: '',
    counter_param: '',
    out_user_id: '',
    order_info: '自动化测试',
    extend_info: '自动化测试',
    callback_url: '',
  },
  version: '3.0',
  req_time: datetime,
}

const timestamp = Math.floor(Date.now() / 1000)
const nonce_str = 'a'.repeat(12)
const body = JSON.stringify(obj)

const content = `${appid}\n${serial_no}\n${timestamp}\n${nonce_str}\n${body}\n`

const sign = crypto.createSign('SHA256')
sign.update(content)
sign.end()

const privateKey = fs.readFileSync('cert/OP00000003_private_key.pem', 'utf8')
const signature = sign.sign(privateKey, 'base64')

const auth = `LKLAPI-SHA256withRSA appid="${appid}",serial_no="${serial_no}",timestamp="${timestamp}",nonce_str="${nonce_str}",signature="${signature}"`

const res = await fetch('https://test.wsmsd.cn/sit/api/v3/ccss/counter/order/special_create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: auth,
  },
  body: body,
})
const text = await res.text()
console.log(text)

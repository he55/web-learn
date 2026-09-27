import * as pay from './pay'
import { log } from './utils'
import amqp from 'amqp-connection-manager'

declare module 'bun' {
  interface Env {
    AMQP_URL: string
  }
}

async function main() {
  const connection = amqp.connect(process.env.AMQP_URL)
  const channel = connection.createChannel()

  const set: Set<string> = new Set()

  const server = Bun.serve({
    routes: {
      '/shouqianba-pay/request': async (req) => {
        const vo = (await req.json()) as pay.PayRequestVo
        const result = await pay.createOrder(vo)
        log('request:', result)
        return Response.json(result)
      },
      '/shouqianba-pay/check': async (req) => {
        const url = new URL(req.url)
        const orderId = url.searchParams.get('payMerTranNo')
        if (!orderId) {
          return new Response('payMerTranNo is required', { status: 500 })
        }

        const msg = await pay.queryOrder(orderId)
        log('check:', msg)
        return Response.json(msg)
      },
      '/shouqianba-pay/msg-notify': async (req) => {
        const data = (await req.json()) as pay.OrderDetail
        const msg = pay.toMessage(data)

        if (set.has(msg.merTranNo)) {
          return Response.json('success')
        }

        set.add(msg.merTranNo)
        log('msg-notify:', msg)

        const result = await channel.publish('exchange.jx', '', Buffer.from(JSON.stringify(msg)), {
          persistent: true,
          priority: 0,
          contentEncoding: 'UTF-8',
          contentType: 'application/json',
          headers: {
            __TypeId__: 'com.example.payservice.dto.PayMessage',
          },
          timeout: 20_000,
        })
        console.log(' [x] Sent message', result)

        return Response.json('success')
      },
    },
    fetch(req, server) {
      return new Response('Not Found', { status: 404 })
    },
  })

  console.log(`Server running at ${server.url}`)
}

main()

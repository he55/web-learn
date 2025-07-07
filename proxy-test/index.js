import { ProxyAgent, setGlobalDispatcher } from 'undici'

const httpDispatcher = new ProxyAgent('http://127.0.0.1:7890')
setGlobalDispatcher(httpDispatcher)

const res = await fetch('https://deno.co/loading')
const text = await res.text()
console.log(text)

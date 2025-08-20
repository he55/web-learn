import CryptoJS from 'crypto-js'

export function generateRandom(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&_[]{}|<>'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

export function buildSignature(message: string): string {
  const charArray = message.split('')
  charArray.sort()
  const newMsg = charArray.join('')
  const hash = CryptoJS.SHA256(newMsg)
  const hashBase64 = hash.toString(CryptoJS.enc.Base64)
  return hashBase64
}

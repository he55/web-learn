import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import stream from 'node:stream/promises'

const result = []
const files = fs.globSync('*/*.mp4')
for (const file of files) {
  const hash = crypto.createHash('md5')
  const input = fs.createReadStream(file)
  await stream.pipeline(input, hash)

  const md5 = hash.digest('hex')
  console.log(file, md5)

  const { dir: category, name: title } = path.parse(file)
  result.push({
    category,
    title,
    md5,
    url: file.replaceAll('\\', '/'),
  })
}

console.table(result)

const data = JSON.stringify(result)
fs.writeFileSync('data.json', data)

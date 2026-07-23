import { $, s3 } from 'bun'
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

type BuildType = 'client' | 'server' | 'all'

const OUTPUT_DIR = 'output'

function help() {
  console.log(`Usage: bx build [flags] <type>
    type=client|server|all

Flags:
    --upload  upload packages to object storage`)
}

function cleanFile(dir: string) {
  console.log('clean...')

  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  fs.mkdirSync(dir)
}

async function getFileMd5(pathname: string) {
  const hasher = new Bun.CryptoHasher('md5')
  const stream = Bun.file(pathname).stream()

  for await (const chunk of stream) {
    hasher.update(chunk)
  }

  return hasher.digest('hex')
}

function getServerVersion() {
  const appConfigFilePath = path.resolve('../Server/AppConfig.cs')
  if (!fs.existsSync(appConfigFilePath)) {
    throw new Error(`file not exists ${appConfigFilePath}`)
  }

  const text = fs.readFileSync(appConfigFilePath, 'utf-8')
  const result = text.match(/Version = "(?<version>.+)";/)

  const version = result?.groups?.['version']
  if (!version) {
    throw new Error('not match server version.')
  }
  return version
}

function getClientVersion() {
  const appConfigFilePath = path.resolve('../Client/KerimHIS.Main/KerimHIS.Main.csproj')
  if (!fs.existsSync(appConfigFilePath)) {
    throw new Error(`file not exists ${appConfigFilePath}`)
  }

  const text = fs.readFileSync(appConfigFilePath, 'utf-8')
  const result = text.match(/<Version>(?<version>.+)<\/Version>/)

  const version = result?.groups?.['version']
  if (!version) {
    throw new Error('not match server version.')
  }
  return version
}

async function uploadFile(pathname: string) {
  console.log('upload', pathname, '...')

  const bunfile = Bun.file(pathname)
  const name = path.basename(pathname)
  await s3.write(`uploads/${name}`, bunfile)
}

async function buildServer() {
  const version = getServerVersion()

  console.log(`build server ${version} ...`)

  const outputPath = path.resolve(version)
  await $`msbuild ../Server/HISServer.csproj -p:Configuration=Release -p:OutputPath=${outputPath}`.quiet()

  const outfile = `server-${version}.zip`
  await $`7z a ${outfile} ${outputPath}`.quiet()

  return outfile
}

async function buildClient() {
  const version = getClientVersion()

  console.log(`build client ${version} ...`)

  const outputPath = path.resolve('Client-Release/bin')
  await $`msbuild ../Client/KerimHIS.Main/KerimHIS.Main.csproj -p:Configuration=Release -p:OutputPath=${outputPath}`.quiet()

  const dllPath = path.resolve('../dll')
  if (fs.existsSync(dllPath)) {
    fs.cpSync(dllPath, outputPath, { recursive: true })
  }
  fs.copyFileSync('../Tools/Launcher.exe', 'Client-Release/Launcher.exe')

  const outfile = `client-${version}.zip`
  await $`7z a ${outfile} Client-Release`.quiet()

  return outfile
}

async function build_cmd(args: string[]) {
  const { values: options, positionals } = parseArgs({
    args: args,
    options: {
      upload: {
        type: 'boolean',
      },
    },
    allowPositionals: true,
  })

  const t = positionals[0] as BuildType
  switch (t) {
    case 'client':
    case 'server':
    case 'all':
      break
    default:
      help()
      return
  }

  cleanFile(OUTPUT_DIR)

  process.chdir(OUTPUT_DIR)

  const outfiles: string[] = []

  switch (t) {
    case 'client':
      outfiles.push(await buildClient())
      break
    case 'server':
      outfiles.push(await buildServer())
      break
    case 'all':
      outfiles.push(await buildServer())
      outfiles.push(await buildClient())
      break
  }

  if (options.upload) {
    console.log('upload files...')

    for (const outfile of outfiles) {
      await uploadFile(outfile)
    }
  }

  console.log('done.')
}

async function main(args: string[]) {
  if (args.length === 0) {
    help()
    return
  }

  const [cmd, ...subargs] = args

  if (cmd === 'build') {
    await build_cmd(subargs)
  } else {
    help()
    return
  }
}

main(Bun.argv.slice(2))

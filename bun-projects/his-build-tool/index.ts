import { $ } from 'bun'
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

type BuildType = 'client' | 'server' | 'all'

function help() {
  console.log('usage: bx build <client|server|all>')
}

function cleanFile() {
  console.log('clean...')

  const output = 'output'
  if (fs.existsSync(output)) {
    fs.rmSync(output, { recursive: true, force: true })
  }

  fs.mkdirSync(output)
  process.chdir(output)
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

async function buildServer() {
  const version = getServerVersion()

  console.log(`build server ${version}...`)
  const outputPath = path.resolve(version)

  await $`msbuild ../Server/HISServer.csproj -p:Configuration=Release -p:OutputPath=${outputPath}`.quiet()
  await $`7z a server-${version}.zip ${outputPath}`.quiet()
}

async function buildClient() {
  console.log('build client...')

  const outputPath = path.resolve('Client-Release/bin')
  await $`msbuild ../Client/KerimHIS.Main/KerimHIS.Main.csproj -p:Configuration=Release -p:OutputPath=${outputPath}`.quiet()

  const dllPath = path.resolve('../dll')
  if (fs.existsSync(dllPath)) {
    fs.cpSync(dllPath, outputPath, { recursive: true })
  }
  fs.copyFileSync('../Tools/Launcher.exe', 'Client-Release/Launcher.exe')

  await $`7z a Client-Release.zip Client-Release`.quiet()
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

  cleanFile()

  switch (t) {
    case 'client':
      await buildClient()
      break
    case 'server':
      await buildServer()
      break
    case 'all':
      await buildServer()
      await buildClient()
      break
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

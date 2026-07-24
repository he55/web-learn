import { env, s3, semver } from 'bun'
import fs from 'node:fs'
import { parseArgs } from 'node:util'

type AppCommand = 'package' | 'update' | 'help'

declare module 'bun' {
  interface Env {
    DOWNLOAD_BASE_URL: string
  }
}

function help() {
  console.log(`Usage: cx package list
       cx update [flags] <org> <version>
Flags:
  -d, --download  download package from remote`)
}

function package_cmd(args: string[]) {
  const [p] = args
  if (p === 'list') {
    const fileNames = fs.globSync('client-*.zip', { cwd: 'packages' })
    const vers = fileNames
      .map((x) => x.slice(7, -4))
      .sort(semver.order)
      .join('  ')
    console.log('packages:')
    console.log(vers)
  } else {
    help()
  }
}

function getConfigFilePaths(org: string) {
  const pattern = org === 'all' ? '*' : org

  const glob = new Bun.Glob(`app/{${pattern}}/update.xml`)

  let filePaths = Array.from(glob.scanSync())
  if (filePaths.length === 0) {
    throw new Error('not found update file')
  }

  return filePaths
}

async function update_cmd(args: string[]) {
  const { values: options, positionals } = parseArgs({
    args: args,
    options: {
      download: {
        type: 'boolean',
        short: 'd',
      },
    },
    allowPositionals: true,
  })

  if (positionals.length < 2) {
    help()
    return
  }

  const [org, version] = positionals

  const packageFilePath = `packages/client-${version}.zip`

  if (options.download) {
    if (!fs.existsSync(packageFilePath)) {
      const name = `uploads/client-${version}.zip`
      if (await s3.exists(name)) {
        console.log('download', name)

        const s3file = s3.file(name)
        const buffer = await s3file.arrayBuffer()
        await Bun.write(packageFilePath, buffer)
      }
    }
  }

  if (!fs.existsSync(packageFilePath)) {
    throw new Error('package not exists')
  }

  const downloadUrl = `${env.DOWNLOAD_BASE_URL}${packageFilePath}`

  const configFilePaths = getConfigFilePaths(org!)

  for (const configPath of configFilePaths) {
    const oldConfig = fs.readFileSync(configPath, 'utf8')
    const newConfig = oldConfig
      .replace(/<Version>(.+)<\/Version>/, `<Version>${version}</Version>`)
      .replace(/<DownloadURL>(.+)<\/DownloadURL>/, `<DownloadURL>${downloadUrl}</DownloadURL>`)

    fs.writeFileSync(configPath, newConfig)

    console.log(`update ${configPath}`)
  }
}

function main(args: string[]) {
  if (args.length === 0) {
    help()
    return
  }

  const [cmd, ...subargs] = args
  switch (cmd as AppCommand) {
    case 'package':
      package_cmd(subargs)
      break
    case 'update':
      update_cmd(subargs)
      break
    default:
      help()
      break
  }
}

main(process.argv.slice(2))

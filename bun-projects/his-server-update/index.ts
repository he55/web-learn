import { $, s3, semver, which } from 'bun'
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

type UxCommand = 'package' | 'update' | 'help'
type WinswCommand = 'install' | 'uninstall' | 'start' | 'stop' | 'restart'
type AppCommand = UxCommand | WinswCommand
type AppConfig = {
  prefix: string
  exec: string
  exclude: string[]
}

const config: AppConfig = await Bun.file('config.json').json()

const { prefix: serverPrefixName, exec: execName, exclude: excludeServerNames } = config

function getServerFiles(serverName: string) {
  const pattern = serverName === 'all' ? '*' : serverName

  const glob = new Bun.Glob(`${serverPrefixName}{${pattern}}/app.xml`)

  let configFilePaths = Array.from(glob.scanSync())
  if (configFilePaths.length === 0) {
    throw new Error('not found server')
  }

  if (pattern !== '*') {
    return configFilePaths
  }

  if (!excludeServerNames.length) {
    return configFilePaths
  }

  configFilePaths = configFilePaths.filter((x) => !excludeServerNames.some((y) => x.includes(y)))

  if (configFilePaths.length === 0) {
    throw new Error('not found server')
  }

  return configFilePaths
}

function help() {
  console.log(`usage: ux package list
       ux update [flags] <server> <version>
       ux install <server>
       ux uninstall <server>
       ux start <server>
       ux stop <server>
       ux restart <server>
flags:
       -d, --download  download package from remote`)
}

function package_cmd(args: string[]) {
  const [p] = args
  if (p === 'list') {
    const bins = fs.globSync('packages/*/')
    const vers = bins
      .map((x) => x.split(path.sep).at(1)!)
      .sort(semver.order)
      .join('  ')
    console.log('packages:')
    console.log(vers)
  } else {
    help()
  }
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

  const [server, version] = positionals

  const binPath = path.resolve(`packages/${version}/${execName}`)
  if (!fs.existsSync(binPath)) {
    const zip = path.resolve(`packages/server-${version}.zip`)

    if (!fs.existsSync(zip) && options.download) {
      const name = `uploads/server-${version}.zip`
      if (await s3.exists(name)) {
        console.log('download', name)

        const buffer = await s3.file(name).arrayBuffer()
        await Bun.write(zip, buffer)
      }
    }

    if (fs.existsSync(zip)) {
      if (!which('7z')) {
        throw new Error('7z not found')
      }
      console.log(`7z x ${zip} -opackages`)
      await $`7z x ${zip} -opackages`.quiet()
    }
  }

  if (!fs.existsSync(binPath)) {
    throw new Error('bin not exists')
  }

  const configFilePaths = getServerFiles(server!)

  for (const configPath of configFilePaths) {
    const oldConfig = fs.readFileSync(configPath, 'utf8')
    const newConfig = oldConfig.replace(
      /<executable>(.+)<\/executable>/i,
      `<executable>${binPath}</executable>`,
    )
    fs.writeFileSync(configPath, newConfig)

    console.log(`winsw restart ${configPath}`)
    await $`winsw restart ${configPath}`.quiet()
  }
}

async function winsw_cmd(args: string[], cmd: WinswCommand) {
  const [server] = args
  if (!server) {
    help()
    return
  }

  const configFilePaths = getServerFiles(server)

  for (const configPath of configFilePaths) {
    console.log(`winsw ${cmd} ${configPath}`)
    await $`winsw ${cmd} ${configPath}`
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
    case 'help':
      help()
      break
    case 'install':
    case 'uninstall':
    case 'start':
    case 'stop':
    case 'restart':
      winsw_cmd(subargs, cmd as WinswCommand)
      break
    default:
      help()
      break
  }
}

main(process.argv.slice(2))

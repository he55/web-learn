import { $ } from 'bun'
import fs from 'node:fs'
import path from 'node:path'
import config from './config.json' // with { type: 'json' }

type UxCommand = 'package' | 'update' | 'help'
type WinswCommand = 'install' | 'uninstall' | 'start' | 'stop' | 'restart'
type AppCommand = UxCommand | WinswCommand

const { prefix: serverPrefixName, exec: execName, exclude: excludeServerNames } = config

main(process.argv.splice(2))

function getServerFiles(serverName: string) {
  const pattern = serverName === 'all' ? '*' : serverName

  let configFilePaths = fs.globSync(`${serverPrefixName}${pattern}/app.xml`)
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
       ux update <server> <version>
       ux install <server>
       ux uninstall <server>
       ux start <server>
       ux stop <server>
       ux restart <server>`)
}

function package_cmd(subargs: string[]) {
  const [c] = subargs
  if (c === 'list') {
    const bins = fs.globSync('packages/*/')
    const vers = bins
      .map((x) => x.split(path.sep).at(1)!)
      .sort((a, b) => b.localeCompare(a))
      .join('  ')
    console.log('packages:')
    console.log(vers)
  } else {
    help()
  }
}

async function update_cmd(subargs: string[]) {
  if (subargs.length < 2) {
    help()
    return
  }

  const [server, version] = subargs

  const binPath = path.resolve(`packages/${version}/${execName}`)
  if (!fs.existsSync(binPath)) {
    throw new Error('bin not exists')
  }

  const configFilePaths = getServerFiles(server!)

  for (const configPath of configFilePaths) {
    const oldConfig = fs.readFileSync(configPath, 'utf8')
    const newConfig = oldConfig.replace(
      /<executable>(.+)<\/executable>/i,
      `<executable>${binPath}</executable>`
    )
    fs.writeFileSync(configPath, newConfig)

    console.log(`winsw restart ${configPath}`)
    await $`winsw restart ${configPath}`.quiet()
  }
}

async function winsw_cmd(subargs: string[], cmd: WinswCommand) {
  const [server] = subargs
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

  const [subcmd, ...subargs] = args
  switch (subcmd as AppCommand) {
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
      winsw_cmd(subargs, subcmd as WinswCommand)
      break
    default:
      help()
      break
  }
}

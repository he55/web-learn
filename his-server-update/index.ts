import { $ } from 'bun'
import fs from 'node:fs'
import path from 'node:path'
import config from './config.json' // with { type: 'json' }

const { prefix: serverPrefixName, exec: execName, exclude: excludeServerNames } = config

main(process.argv.splice(2))

function help() {
  console.log(`usage: ux package list
       ux update <server> <version>
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

function getServerFiles(serverName: string) {
  const pattern = serverName === 'all' ? '*' : serverName

  let configFilePaths = fs.globSync(`${serverPrefixName}${pattern}/app.xml`)
  if (configFilePaths.length === 0) {
    throw new Error('not found server')
  }

  const hasItem = excludeServerNames?.length > 0
  if (hasItem) {
    configFilePaths = configFilePaths.filter((x) => !excludeServerNames.some((y) => x.includes(y)))

    if (configFilePaths.length === 0) {
      throw new Error('not found server')
    }
  }

  return configFilePaths
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

type WinswCmd = 'start' | 'stop' | 'restart'

async function winsw_cmd(subargs: string[], cmd: WinswCmd) {
  const [server] = subargs
  if (!server) {
    help()
    return
  }

  const configFilePaths = getServerFiles(server)

  for (const configPath of configFilePaths) {
    console.log(`winsw ${cmd} ${configPath}`)
    await $`winsw ${cmd} ${configPath}`.quiet()
  }
}

function main(args: string[]) {
  if (args.length === 0) {
    help()
    return
  }

  const [subcmd, ...subargs] = args
  if (subcmd === 'help') {
    help()
  } else if (subcmd === 'package') {
    package_cmd(subargs)
  } else if (subcmd === 'update') {
    update_cmd(subargs)
  } else if (subcmd === 'start') {
    winsw_cmd(subargs, 'start')
  } else if (subcmd === 'stop') {
    winsw_cmd(subargs, 'stop')
  } else if (subcmd === 'restart') {
    winsw_cmd(subargs, 'restart')
  } else {
    help()
  }
}

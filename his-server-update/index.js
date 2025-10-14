import 'zx/globals'
import config from './config.json' with { type: 'json' }

usePowerShell()

const { prefix: serverPrefixName, exec: execName, exclude: excludeServerNames } = config

main(process.argv.splice(3))

function help() {
  console.log(`usage: ux package list
       ux update <server> <version>`)
}

/**
 *
 * @param {string[]} subargs
 */
function bin_cmd(subargs) {
  const [c] = subargs
  if (c === 'list') {
    const bins = fs.globSync('packages/*/')
    const vers = bins
      .map((x) => x.split(path.sep)[1])
      .sort((a, b) => b.localeCompare(a))
      .join('  ')
    console.log('packages:')
    console.log(vers)
  } else {
    help()
  }
}

/**
 *
 * @param {string[]} subargs
 */
async function update_cmd(subargs) {
  if (subargs.length < 2) {
    help()
    return
  }

  const [server, version] = subargs

  const binPath = path.resolve(`packages/${version}/${execName}`)
  if (!fs.existsSync(binPath)) {
    throw new Error('bin not exists')
  }

  const pattern = server === 'all' ? '*' : server

  const configFilePaths = fs.globSync(`${serverPrefixName}${pattern}/app.xml`)
  if (configFilePaths.length === 0) {
    throw new Error('not found server')
  }

  const hasItem = excludeServerNames?.length > 0

  for (const configPath of configFilePaths) {
    if (hasItem && excludeServerNames.some((x) => configPath.includes(x))) {
      continue
    }

    const oldConfig = fs.readFileSync(configPath, 'utf8')
    const newConfig = oldConfig.replace(
      /<executable>(.+)<\/executable>/i,
      `<executable>${binPath}</executable>`
    )
    fs.writeFileSync(configPath, newConfig)

    console.log(`winsw restart ${configPath}`)
    await $`winsw restart ${configPath}`
  }
}

/**
 *
 * @param {string[]} args
 * @returns
 */
function main(args) {
  if (args.length === 0) {
    help()
    return
  }

  const [subcmd, ...subargs] = args
  if (subcmd === 'help') {
    help()
  } else if (subcmd === 'package') {
    bin_cmd(subargs)
  } else if (subcmd === 'update') {
    update_cmd(subargs)
  } else {
    help()
  }
}

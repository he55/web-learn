import 'zx/globals'

// usePowerShell();

main(process.argv.splice(3))

function help() {
  console.log(`usage: package list
    update <version> <server>`)
}

/**
 *
 * @param {string[]} subargs
 */
function bin_cmd(subargs) {
  const [c] = subargs
  if (c === 'list') {
    const bins = fs.globSync('bin/*/')
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
function update_cmd(subargs) {
  if (subargs.length < 2) {
    help()
    return
  }

  const [version, server] = subargs

  const binPath = `bin/${version}/HISServer.exe`
  if (!fs.existsSync(binPath)) {
    throw new Error('bin not exists')
  }

  const b = server === 'all' ? '*' : server

  const configFilePaths = fs.globSync(`HISServer_${b}/app.xml`)
  for (const configPath of configFilePaths) {
    const oldConfig = fs.readFileSync(configPath, 'utf8')
    const newConfig = oldConfig.replace(
      /<executable>(.+)<\/executable>/i,
      `<executable>${binPath}</executable>`
    )
    fs.writeFileSync(configPath, newConfig)

    // TODO:
    console.log(`winsw restart ${configPath}`)
  }
}

/**
 *
 * @param {string[]} args
 * @returns
 */
async function main(args) {
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

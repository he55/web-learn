import { env, inspect, s3, semver } from 'bun'
import fs from 'node:fs'
import { parseArgs } from 'node:util'

type AppCommand = 'package' | 'update' | 'help'

declare module 'bun' {
  interface Env {
    DOWNLOAD_BASE_URL: string
  }
}

const CLIENT_PKG_PREFIX = 'uploads/client-'

function help() {
  console.log(`usage: cx package list
       cx update [flags] <org> <version>
flags:
       -d, --download  download package from remote`)
}

async function package_cmd(args: string[]) {
  const [p] = args
  if (p === 'local') {
    const packages = fs.globSync('client-*.zip', { cwd: 'packages' })

    if (packages.length === 0) {
      console.log('no package on local')
      return
    }

    const data = packages
      .map((x) => x.slice(7, -4))
      .sort(semver.order)
      .join('  ')

    console.log(data)
  } else if (p === 'remote') {
    const uploads = await s3.list({ prefix: CLIENT_PKG_PREFIX })

    if (!uploads.contents) {
      console.log('no packages on remote')
      return
    }

    const data = uploads.contents.map((x) => ({ date: x.lastModified, name: x.key, size: x.size }))
    console.log(inspect.table(data))
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
      uses3: {
        type: 'boolean',
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
  const name = `${CLIENT_PKG_PREFIX}${version}.zip`
  let downloadUrl = `${env.DOWNLOAD_BASE_URL}${packageFilePath}`

  if (options.download) {
    if (!(await s3.exists(name))) {
      throw new Error('package not exist on remote')
    }

    console.log('download', name)

    const buffer = await s3.file(name).arrayBuffer()
    await Bun.write(packageFilePath, buffer)
  } else if (options.uses3) {
    if (!(await s3.exists(name))) {
      throw new Error('package not exist on remote')
    }

    const url = s3.presign(name, { expiresIn: 7 * 24 * 3600 })
    downloadUrl = url.replaceAll('&', '&amp;')
  } else {
    if (!fs.existsSync(packageFilePath)) {
      throw new Error('package not exists')
    }
  }

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

async function main(args: string[]) {
  if (args.length === 0) {
    help()
    return
  }

  const [cmd, ...subargs] = args
  switch (cmd as AppCommand) {
    case 'package':
      await package_cmd(subargs)
      break
    case 'update':
      await update_cmd(subargs)
      break
    default:
      help()
      break
  }
}

main(process.argv.slice(2))

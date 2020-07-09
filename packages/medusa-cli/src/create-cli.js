const path = require(`path`)
const resolveCwd = require(`resolve-cwd`)
const yargs = require(`yargs`)
const { getLocalMedusaVersion } = require(`./util/version`)
const { didYouMean } = require(`./did-you-mean`)
const existsSync = require(`fs-exists-cached`).sync

const handlerP = fn => (...args) => {
  Promise.resolve(fn(...args)).then(
    () => process.exit(0),
    err => console.log(err)
  )
}

function buildLocalCommands(cli, isLocalProject) {
  const defaultHost = `localhost`
  const defaultPort = `9000`
  const directory = path.resolve(`.`)

  const projectInfo = { directory }
  const useYarn = existsSync(path.join(directory, `yarn.lock`))

  if (isLocalProject) {
    const json = require(path.join(directory, `package.json`))
    projectInfo.sitePackageJson = json
  }

  function getLocalMedusaMajorVersion() {
    let version = getLocalMedusaVersion()

    if (version) {
      version = Number(version.split(`.`)[0])
    }

    return version
  }

  function resolveLocalCommand(command) {
    if (!isLocalProject) {
      cli.showHelp()
    }

    try {
      const cmdPath = resolveCwd.silent(
        `@medusajs/medusa/dist/commands/${command}`
      )
      return require(cmdPath).default
    } catch (err) {
      cli.showHelp()
    }
  }

  function getCommandHandler(command, handler) {
    return argv => {
      const localCmd = resolveLocalCommand(command)
      const args = { ...argv, ...projectInfo, useYarn }

      // report.verbose(`running command: ${command}`)
      return handler ? handler(args, localCmd) : localCmd(args)
    }
  }

  cli
    .command({
      command: `develop`,
      desc: `Start development server. Watches file and rebuilds when something changes`,
      builder: _ =>
        _.option(`H`, {
          alias: `host`,
          type: `string`,
          default: defaultHost,
          describe: `Set host. Defaults to ${defaultHost}`,
        }).option(`p`, {
          alias: `port`,
          type: `string`,
          default: process.env.PORT || defaultPort,
          describe: process.env.PORT
            ? `Set port. Defaults to ${process.env.PORT} (set by env.PORT) (otherwise defaults ${defaultPort})`
            : `Set port. Defaults to ${defaultPort}`,
        }),
      handler: handlerP(
        getCommandHandler(`develop`, (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          cmd(args)
          // Return an empty promise to prevent handlerP from exiting early.
          // The development server shouldn't ever exit until the user directly
          // kills it so this is fine.
          return new Promise(resolve => {})
        })
      ),
    })
    .command({
      command: `start`,
      desc: `Start development server.`,
      builder: _ =>
        _.option(`H`, {
          alias: `host`,
          type: `string`,
          default: defaultHost,
          describe: `Set host. Defaults to ${defaultHost}`,
        }).option(`p`, {
          alias: `port`,
          type: `string`,
          default: process.env.PORT || defaultPort,
          describe: process.env.PORT
            ? `Set port. Defaults to ${process.env.PORT} (set by env.PORT) (otherwise defaults ${defaultPort})`
            : `Set port. Defaults to ${defaultPort}`,
        }),
      handler: handlerP(
        getCommandHandler(`start`, (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          cmd(args)
          // Return an empty promise to prevent handlerP from exiting early.
          // The development server shouldn't ever exit until the user directly
          // kills it so this is fine.
          return new Promise(resolve => {})
        })
      ),
    })
    .command({
      command: `user`,
      desc: `Create a user`,
      builder: _ =>
        _.option(`e`, {
          alias: `email`,
          type: `string`,
          describe: `User's email.`,
        }).option(`p`, {
          alias: `password`,
          type: `string`,
          describe: `User's password.`,
        }),
      handler: handlerP(
        getCommandHandler(`user`, (args, cmd) => {
          cmd(args)
          // Return an empty promise to prevent handlerP from exiting early.
          // The development server shouldn't ever exit until the user directly
          // kills it so this is fine.
          return new Promise(resolve => {})
        })
      ),
    })
}

function isLocalMedusaProject() {
  let inMedusaProject = false
  try {
    const { dependencies, devDependencies } = require(path.resolve(
      `./package.json`
    ))
    inMedusaProject =
      (dependencies && dependencies["@medusajs/medusa"]) ||
      (devDependencies && devDependencies["@medusajs/medusa"])
  } catch (err) {
    /* ignore */
  }
  return !!inMedusaProject
}

function getVersionInfo() {
  const { version } = require(`../package.json`)
  const isMedusaProject = isLocalMedusaProject()
  if (isMedusaProject) {
    let medusaVersion = getLocalMedusaVersion()

    if (!medusaVersion) {
      medusaVersion = `unknown`
    }

    return `Medusa CLI version: ${version}
Medusa version: ${medusaVersion}
  Note: this is the Medusa version for the site at: ${process.cwd()}`
  } else {
    return `Medusa CLI version: ${version}`
  }
}

module.exports = argv => {
  const cli = yargs()
  const isLocalProject = isLocalMedusaProject()

  cli
    .scriptName(`medusa`)
    .usage(`Usage: $0 <command> [options]`)
    .alias(`h`, `help`)
    .alias(`v`, `version`)
    .option(`verbose`, {
      default: false,
      type: `boolean`,
      describe: `Turn on verbose output`,
      global: true,
    })
    .option(`no-color`, {
      alias: `no-colors`,
      default: false,
      type: `boolean`,
      describe: `Turn off the color in output`,
      global: true,
    })
    .option(`json`, {
      describe: `Turn on the JSON logger`,
      default: false,
      type: `boolean`,
      global: true,
    })

  buildLocalCommands(cli, isLocalProject)

  try {
    cli.version(
      `version`,
      `Show the version of the Medusa CLI and the Medusa package in the current project`,
      getVersionInfo()
    )
  } catch (e) {
    // ignore
  }

  return cli
    .wrap(cli.terminalWidth())
    .demandCommand(1, `Pass --help to see all available commands and options.`)
    .strict()
    .fail((msg, err, yargs) => {
      const availableCommands = yargs.getCommands().map(commandDescription => {
        const [command] = commandDescription
        return command.split(` `)[0]
      })
      const arg = argv.slice(2)[0]
      const suggestion = arg ? didYouMean(arg, availableCommands) : ``

      cli.showHelp()
      // report.log(suggestion)
      // report.log(msg)
    })
    .parse(argv.slice(2))
}

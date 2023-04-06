const path = require(`path`)
const resolveCwd = require(`resolve-cwd`)
const yargs = require(`yargs`)
const existsSync = require(`fs-exists-cached`).sync
const { setTelemetryEnabled } = require("medusa-telemetry")

const { getLocalMedusaVersion } = require(`./util/version`)
const { didYouMean } = require(`./did-you-mean`)

const reporter = require("./reporter").default
const { newStarter } = require("./commands/new")
const { whoami } = require("./commands/whoami")
const { login } = require("./commands/login")
const { link } = require("./commands/link")

const handlerP =
  (fn) =>
  (...args) => {
    Promise.resolve(fn(...args)).then(
      () => process.exit(0),
      (err) => console.log(err)
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
      if (process.env.NODE_ENV !== "production") {
        console.log("--------------- ERROR ---------------------")
        console.log(err)
        console.log("-------------------------------------------")
      }
      cli.showHelp()
    }
  }

  function getCommandHandler(command, handler) {
    return (argv) => {
      const localCmd = resolveLocalCommand(command)
      const args = { ...argv, ...projectInfo, useYarn }

      return handler ? handler(args, localCmd) : localCmd(args)
    }
  }

  cli
    .command({
      command: `new [root] [starter]`,
      builder: (_) =>
        _.option(`seed`, {
          type: `boolean`,
          describe: `If flag is set the command will attempt to seed the database after setup.`,
          default: false,
        })
          .option(`y`, {
            type: `boolean`,
            alias: "useDefaults",
            describe: `If flag is set the command will not interactively collect database credentials`,
            default: false,
          })
          .option(`skip-db`, {
            type: `boolean`,
            describe: `If flag is set the command will not attempt to complete database setup`,
            default: false,
          })
          .option(`skip-migrations`, {
            type: `boolean`,
            describe: `If flag is set the command will not attempt to complete database migration`,
            default: false,
          })
          .option(`skip-env`, {
            type: `boolean`,
            describe: `If flag is set the command will not attempt to populate .env`,
            default: false,
          })
          .option(`db-user`, {
            type: `string`,
            describe: `The database user to use for database setup and migrations.`,
          })
          .option(`db-database`, {
            type: `string`,
            describe: `The database use for database setup and migrations.`,
          })
          .option(`db-pass`, {
            type: `string`,
            describe: `The database password to use for database setup and migrations.`,
          })
          .option(`db-port`, {
            type: `number`,
            describe: `The database port to use for database setup and migrations.`,
          })
          .option(`db-host`, {
            type: `string`,
            describe: `The database host to use for database setup and migrations.`,
          }),
      desc: `Create a new Medusa project.`,
      handler: handlerP(newStarter),
    })
    .command({
      command: `telemetry`,
      describe: `Enable or disable collection of anonymous usage data.`,
      builder: (yargs) =>
        yargs
          .option(`enable`, {
            type: `boolean`,
            description: `Enable telemetry (default)`,
          })
          .option(`disable`, {
            type: `boolean`,
            description: `Disable telemetry`,
          }),

      handler: handlerP(({ enable, disable }) => {
        const enabled = Boolean(enable) || !disable
        setTelemetryEnabled(enabled)
        reporter.info(
          `Telemetry collection ${enabled ? `enabled` : `disabled`}`
        )
      }),
    })
    .command({
      command: `seed`,
      desc: `Migrates and populates the database with the provided file.`,
      builder: (_) =>
        _.option(`f`, {
          alias: `seed-file`,
          type: `string`,
          describe: `Path to the file where the seed is defined.`,
          required: true,
        }).option(`m`, {
          alias: `migrate`,
          type: `boolean`,
          default: true,
          describe: `Flag to indicate if migrations should be run prior to seeding the database`,
        }),
      handler: handlerP(
        getCommandHandler(`seed`, (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: `migrations [action]`,
      desc: `Manage migrations from the core and your own project`,
      builder: {
        action: {
          demand: true,
          choices: ["run", "revert", "show"],
        },
      },
      handler: handlerP(
        getCommandHandler(`migrate`, (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: `whoami`,
      desc: `View the details of the currently logged in user.`,
      handler: handlerP(whoami),
    })
    .command({
      command: `link`,
      desc: `Creates your Medusa Cloud user in your local database for local testing.`,
      builder: (_) =>
        _.option(`su`, {
          alias: `skip-local-user`,
          type: `boolean`,
          default: false,
          describe: `If set a user will not be created in the database.`,
        }).option(`develop`, {
          type: `boolean`,
          default: false,
          describe: `If set medusa develop will be run after successful linking.`,
        }),
      handler: handlerP((argv) => {
        if (!isLocalProject) {
          console.log("must be a local project")
          cli.showHelp()
        }

        const args = { ...argv, ...projectInfo, useYarn }

        return link(args)
      }),
    })
    .command({
      command: `login`,
      desc: `Logs you into Medusa Cloud.`,
      handler: handlerP(login),
    })
    .command({
      command: `develop`,
      desc: `Start development server. Watches file and rebuilds when something changes`,
      builder: (_) =>
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
          return new Promise((resolve) => {})
        })
      ),
    })
    .command({
      command: `start`,
      desc: `Start development server.`,
      builder: (_) =>
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
          return new Promise((resolve) => {})
        })
      ),
    })
    .command({
      command: `user`,
      desc: `Create a user`,
      builder: (_) =>
        _.option(`e`, {
          alias: `email`,
          type: `string`,
          describe: `User's email.`,
        })
          .option(`p`, {
            alias: `password`,
            type: `string`,
            describe: `User's password.`,
          })
          .option(`i`, {
            alias: `id`,
            type: `string`,
            describe: `User's id.`,
          }),
      handler: handlerP(
        getCommandHandler(`user`, (args, cmd) => {
          cmd(args)
          // Return an empty promise to prevent handlerP from exiting early.
          // The development server shouldn't ever exit until the user directly
          // kills it so this is fine.
          return new Promise((resolve) => {})
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

module.exports = (argv) => {
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
      const availableCommands = yargs
        .getCommands()
        .map((commandDescription) => {
          const [command] = commandDescription
          return command.split(` `)[0]
        })
      const arg = argv.slice(2)[0]
      const suggestion = arg ? didYouMean(arg, availableCommands) : ``

      if (process.env.NODE_ENV !== "production") {
        console.log("--------------- ERROR ---------------------")
        console.log(err)
        console.log("-------------------------------------------")
      }

      cli.showHelp()
      reporter.info(suggestion)
      reporter.info(msg)
    })
    .parse(argv.slice(2))
}

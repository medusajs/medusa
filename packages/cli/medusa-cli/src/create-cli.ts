import { setTelemetryEnabled } from "@medusajs/telemetry"
import { sync as existsSync } from "fs-exists-cached"
import path from "path"
import resolveCwd from "resolve-cwd"
import { getCodemod, listCodemods } from "./codemods/index"
import { newStarter } from "./commands/new"
import { didYouMean } from "./did-you-mean"
import reporter from "./reporter"

const yargs = require(`yargs`)

const handlerP =
  (fn) =>
  (...args) => {
    Promise.resolve(fn(...args)).then(
      () => process.exit(0),
      (err) => console.log(err)
    )
  }

function buildLocalCommands(cli, isLocalProject) {
  const defaultPort = "9000"
  const directory = path.resolve(`.`)

  const projectInfo = { directory }
  const useYarn = existsSync(path.join(directory, `yarn.lock`))

  if (isLocalProject) {
    projectInfo["sitePackageJson"] = require(path.join(
      directory,
      `package.json`
    ))
  }

  function resolveLocalCommand(command) {
    if (!isLocalProject && command !== "new") {
      console.error(
        `The "${command}" command must be run inside a Medusa project. Make sure you are in the root directory of a Medusa project and try again.`
      )
      process.exit(1)
    }

    try {
      const cmdPath = resolveCwd.silent(`@medusajs/medusa/commands/${command}`)!
      return require(cmdPath).default
    } catch (err) {
      console.error(err)
      cli.showHelp((s: string) => console.error(s))
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
          })
          .option(`v2`, {
            type: `boolean`,
            describe: `Install Medusa with the V2 feature flag enabled. WARNING: Medusa V2 is still in development and shouldn't be used in production.`,
            default: false,
          })
          .option(`branch`, {
            type: `string`,
            describe: `The branch of the git repository to clone.`,
          }),
      desc: `Create a new Medusa project.`,
      handler: handlerP(newStarter),
    })
    .command({
      command: "db:setup",
      desc: "Create the database, run migrations and sync links",
      builder: (builder) => {
        builder.option("db", {
          type: "string",
          describe: "Specify the name of the database you want to create",
        })
        builder.option("interactive", {
          type: "boolean",
          default: true,
          describe:
            "Display prompts. Use --no-interactive flag to run the command without prompts",
        })
        builder.option("skip-links", {
          type: "boolean",
          describe: "Do not sync links",
        })
        builder.option("execute-all-links", {
          type: "boolean",
          describe:
            "Skip prompts and execute all (including unsafe) actions from sync links",
        })
        builder.option("execute-safe-links", {
          type: "boolean",
          describe:
            "Skip prompts and execute only safe actions from sync links",
        })
      },
      handler: handlerP(
        getCommandHandler("db/setup", (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: "db:create",
      desc: "Create the database used by your application",
      builder: (builder) => {
        builder.option("db", {
          type: "string",
          describe: "Specify the name of the database you want to create",
        })
        builder.option("interactive", {
          type: "boolean",
          default: true,
          describe:
            "Display prompts. Use --no-interactive flag to run the command without prompts",
        })
      },
      handler: handlerP(
        getCommandHandler("db/create", (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: "db:migrate",
      desc: "Migrate the database by executing pending migrations",
      builder: (builder) => {
        builder.option("skip-scripts", {
          type: "boolean",
          describe: "Do not run migration scripts",
        })
        builder.option("skip-links", {
          type: "boolean",
          describe: "Do not sync links",
        })
        builder.option("execute-all-links", {
          type: "boolean",
          describe:
            "Skip prompts and execute all (including unsafe) actions from sync links",
        })
        builder.option("execute-safe-links", {
          type: "boolean",
          describe:
            "Skip prompts and execute only safe actions from sync links",
        })
        builder.option("concurrency", {
          type: "number",
          describe: "Number of concurrent migrations to run",
        })
        builder.option("all-or-nothing", {
          type: "boolean",
          describe:
            "If set, the command will fail if any migration fails and revert the migrations that were applied so far",
          default: false,
        })
      },
      handler: handlerP(
        getCommandHandler("db/migrate", (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: "db:migrate:scripts",
      desc: "Run all migration scripts",
      handler: handlerP(
        getCommandHandler("db/run-scripts", (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: "db:rollback [modules...]",
      desc: "Rollback last batch of executed migrations for a given module",
      builder: {
        modules: {
          type: "array",
          description: "Modules for which to rollback migrations",
          demand: true,
        },
      },
      handler: handlerP(
        getCommandHandler("db/rollback", (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: "db:generate [modules...]",
      desc: "Generate migrations for a given module",
      builder: {
        modules: {
          type: "array",
          description: "Modules for which to generate migration files",
          demand: true,
        },
      },
      handler: handlerP(
        getCommandHandler("db/generate", (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: "plugin:db:generate",
      desc: "Generate migrations for modules in a plugin",
      handler: handlerP(
        getCommandHandler("plugin/db/generate", (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: "db:sync-links",
      desc: "Sync database schema with the links defined by your application and Medusa core",
      builder: (builder) => {
        builder.option("execute-all", {
          type: "boolean",
          describe: "Skip prompts and execute all (including unsafe) actions",
        })
        builder.option("execute-safe", {
          type: "boolean",
          describe: "Skip prompts and execute only safe actions",
        })
        builder.option("concurrency", {
          type: "number",
          describe: "Number of concurrent migrations to run",
        })
      },
      handler: handlerP(
        getCommandHandler("db/sync-links", (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          return cmd(args)
        })
      ),
    })
    .command({
      command: "plugin:build",
      desc: "Build plugin source for publishing to a package registry",
      handler: handlerP(
        getCommandHandler("plugin/build", async (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          cmd(args)
          return new Promise((resolve) => {})
        })
      ),
    })
    .command({
      command: "plugin:develop",
      desc: "Start plugin development process in watch mode. Changes will be re-published to the local packages registry",
      handler: handlerP(
        getCommandHandler("plugin/develop", async (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          cmd(args)
          return new Promise(() => {})
        })
      ),
    })
    .command({
      command: "plugin:publish",
      desc: "Publish the plugin to the local packages registry",
      handler: handlerP(
        getCommandHandler("plugin/publish", async (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          cmd(args)
          return new Promise(() => {})
        })
      ),
    })
    .command({
      command: "plugin:add [plugin_names...]",
      desc: "Add the specified plugin to the project from the local packages registry",
      builder: {
        plugin_names: {
          type: "array",
          description: "The name of the plugins to add",
          demand: true,
        },
      },
      handler: handlerP(
        getCommandHandler("plugin/add", async (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          cmd(args)
          return new Promise(() => {})
        })
      ),
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
      command: `codemod <codemod-name>`,
      desc: `Run automated code transformations`,
      builder: (yargs) =>
        yargs
          .positional("codemod-name", {
            type: "string",
            describe: "Name of the codemod to run",
            demandOption: true,
          })
          .option(`dry-run`, {
            type: `boolean`,
            description: `Preview changes without modifying files`,
            default: false,
          }),
      handler: handlerP(async ({ codemodName, dryRun }) => {
        const codemod = getCodemod(codemodName)

        if (!codemod) {
          const available = listCodemods()
          reporter.error(`Unknown codemod: ${codemodName}`)
          reporter.info(
            `\nAvailable codemods:\n${available
              .map((n) => `  - ${n}`)
              .join("\n")}`
          )
          process.exit(1)
        }

        reporter.info(`Running codemod: ${codemod.name}`)
        reporter.info(codemod.description)

        if (dryRun) {
          reporter.info(`\n  DRY RUN MODE - No files will be modified\n`)
        }

        const result = await codemod.run({ dryRun })

        reporter.info(`\n Summary:`)
        reporter.info(`   Files scanned: ${result.filesScanned}`)
        reporter.info(`   Files modified: ${result.filesModified}`)
        reporter.info(`   Errors: ${result.errors}`)

        if (dryRun && result.filesModified > 0) {
          reporter.info(`\n Run without --dry-run to apply changes`)
        } else if (result.filesModified > 0) {
          reporter.info(`\n Codemod completed successfully!`)
          reporter.info(`\n Next steps:`)
          reporter.info(`   1. Review changes: git diff`)
          reporter.info(`   2. Run tests to verify`)
          reporter.info(`   3. Commit if satisfied`)
        } else {
          reporter.info(`\n No modifications needed`)
        }
      }),
    })
    .command({
      command: `develop`,
      desc: `Start development server. Watches file and rebuilds when something changes`,
      builder: (_) =>
        _.option("types", {
          type: "boolean",
          default: true,
          describe:
            "Generate automated types for modules inside the .medusa directory",
        })
          .option(`H`, {
            alias: `host`,
            type: `string`,
            default: process.env.HOST,
            describe: process.env.HOST
              ? `Set host. Defaults to ${process.env.HOST} (set by env.HOST)`
              : "",
          })
          .option(`p`, {
            alias: `port`,
            type: `string`,
            default: process.env.PORT || defaultPort,
            describe: process.env.PORT
              ? `Set port. Defaults to ${process.env.PORT} (set by env.PORT) (otherwise defaults ${defaultPort})`
              : `Set port. Defaults to ${defaultPort}`,
          }),
      handler: handlerP(
        getCommandHandler(`develop`, async (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`

          cmd(args)
          // Return an empty promise to prevent handlerP from exiting early.
          // The development server shouldn't ever exit until the user directly
          // kills it so this is fine.
          return new Promise(() => {})
        })
      ),
    })
    .command({
      command: `start`,
      desc: `Start production server.`,
      builder: (_) =>
        _.option("types", {
          type: "boolean",
          default: false,
          describe:
            "Generate automated types for modules inside the .medusa directory",
        })
          .option(`H`, {
            alias: `host`,
            type: `string`,
            default: process.env.HOST,
            describe: process.env.HOST
              ? `Set host. Defaults to ${process.env.HOST} (set by env.HOST)`
              : ``,
          })
          .option(`p`, {
            alias: `port`,
            type: `string`,
            default: process.env.PORT || defaultPort,
            describe: process.env.PORT
              ? `Set port. Defaults to ${process.env.PORT} (set by env.PORT) (otherwise defaults ${defaultPort})`
              : `Set port. Defaults to ${defaultPort}`,
          })
          .option(`cluster`, {
            type: `string`,
            describe:
              "Start the Node.js server in cluster mode. Specify the number of CPUs to use or a percentage (e.g., 50%). Defaults to the number of available CPUs.",
          })
          .option("workers", {
            type: "string",
            default: "0",
            describe:
              "Number of worker processes in cluster mode or a percentage of cluster size (e.g., 25%).",
          })
          .option("servers", {
            type: "string",
            default: "0",
            describe:
              "Number of server processes in cluster mode or a percentage of cluster size (e.g., 25%).",
          }),
      handler: handlerP(
        getCommandHandler(`start`, async (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `production`
          cmd(args)
          // Return an empty promise to prevent handlerP from exiting early.
          // The development server shouldn't ever exit until the user directly
          // kills it so this is fine.
          return new Promise((resolve) => {})
        })
      ),
    })
    .command({
      command: "build",
      desc: "Build your project.",
      builder: (_) =>
        _.option("admin-only", {
          default: false,
          type: "boolean",
          describe:
            "Only build the admin to serve it separately (outDir .medusa/admin)",
        }),
      handler: handlerP(
        getCommandHandler(`build`, async (args, cmd) => {
          process.env.NODE_ENV = process.env.NODE_ENV || `development`
          cmd(args)

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
          })
          .option(`invite`, {
            type: `boolean`,
            describe: `If flag is set, an invitation will be created instead of a new user and the invite token will be returned.`,
            default: false,
          }),
      handler: handlerP(
        getCommandHandler(`user`, async (args, cmd) => {
          cmd(args)
          // Return an empty promise to prevent handlerP from exiting early.
          // The development server shouldn't ever exit until the user directly
          // kills it so this is fine.
          return new Promise((resolve) => {})
        })
      ),
    })
    .command({
      command: `exec [file] [args..]`,
      desc: `Run a function defined in a file.`,
      handler: handlerP(
        getCommandHandler(`exec`, async (args, cmd) => {
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
    // Draft order plugin can't have @medusajs/medusa as dependency,
    // so we also check for @medusajs/cli 
    inMedusaProject = !!(
      (dependencies &&
        (dependencies["@medusajs/medusa"] || dependencies["@medusajs/cli"])) ||
      (devDependencies &&
        (devDependencies["@medusajs/medusa"] ||
          devDependencies["@medusajs/cli"]))
    )
  } catch (err) {
    // ignore
  }

  return inMedusaProject
}

function getVersionInfo() {
  const { version } = require(`../package.json`)
  const isMedusaProject = isLocalMedusaProject()
  if (isMedusaProject) {
    let medusaVersion = ""
    try {
      medusaVersion = require(path.join(
        process.cwd(),
        `node_modules`,
        `@medusajs/medusa`,
        `package.json`
      )).version
    } catch (e) {
      /* noop */
    }

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

export default (argv) => {
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

      if (msg) {
        reporter.error(msg)
        console.log()
      }
      if (suggestion) {
        reporter.info(suggestion)
        console.log()
      }

      if (err) {
        console.error("--------------- ERROR ---------------------")
        console.error(err)
        console.error("-------------------------------------------")
      }

      cli.showHelp((s: string) => console.error(s))
      process.exit(1)
    })
    .parse(argv.slice(2))
}

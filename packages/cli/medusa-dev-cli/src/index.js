#!/usr/bin/env node

const Configstore = require(`configstore`)
const pkg = require(`../package.json`)
const _ = require(`lodash`)
const yargs = require(`yargs/yargs`)
const path = require(`path`)
const os = require(`os`)
const fs = require(`fs-extra`)
const glob = require("glob")
const watch = require(`./watch`)
const { getVersionInfo } = require(`./utils/version`)
const { buildFFCli } = require("./feature-flags")

const cli = yargs()

cli.command({
  command: `*`,
  description: `Start the Medusa dev CLI`,
  builder: (yargs) => {
    yargs
      .usage(`Usage: medusa-dev [options]`)
      .alias(`q`, `quiet`)
      .nargs(`q`, 0)
      .describe(`q`, `Do not output copy file information`)
      .alias(`s`, `scan-once`)
      .nargs(`s`, 0)
      .describe(`s`, `Scan once. Do not start file watch`)
      .alias(`p`, `set-path-to-repo`)
      .nargs(`p`, 1)
      .describe(
        `p`,
        `Set path to medusa repository.
You typically only need to configure this once.`
      )
      .nargs(`force-install`, 0)
      .describe(
        `force-install`,
        `Disables copying files into node_modules and forces usage of local npm repository.`
      )
      .nargs(`external-registry`, 0)
      .describe(
        `external-registry`,
        `Run 'yarn add' commands without the --registry flag.`
      )
      .alias(`C`, `copy-all`)
      .nargs(`C`, 0)
      .describe(
        `C`,
        `Copy all contents in packages/ instead of just medusa packages`
      )
      .array(`packages`)
      .describe(`packages`, `Explicitly specify packages to copy`)
      .help(`h`)
      .alias(`h`, `help`)
      .nargs(`v`, 0)
      .alias(`v`, `version`)
      .describe(`v`, `Print the currently installed version of Medusa Dev CLI`)
  },
  handler: async (argv) => {
    const conf = new Configstore(pkg.name)

    if (argv.version) {
      console.log(getVersionInfo())
      process.exit()
    }

    let pathToRepo = argv.setPathToRepo

    if (pathToRepo) {
      if (pathToRepo.includes(`~`)) {
        pathToRepo = path.join(os.homedir(), pathToRepo.split(`~`).pop())
      }
      conf.set(`medusa-location`, path.resolve(pathToRepo))
      process.exit()
    }

    const havePackageJsonFile = fs.existsSync(`package.json`)

    if (!havePackageJsonFile) {
      console.error(`Current folder must have a package.json file!`)
      process.exit()
    }

    const medusaLocation = conf.get(`medusa-location`)

    if (!medusaLocation) {
      console.error(
        `
You haven't set the path yet to your cloned
version of medusa. Do so now by running:
medusa-dev --set-path-to-repo /path/to/my/cloned/version/medusa
`
      )
      process.exit()
    }

    // get list of directories to crawl for package declarations
    const monoRepoPackagesDirs = []
    try {
      const monoRepoPkg = JSON.parse(
        fs.readFileSync(path.join(medusaLocation, "package.json"))
      )
      for (const workspace of monoRepoPkg.workspaces.packages) {
        if (!workspace.startsWith("packages")) {
          continue
        }
        const workspacePackageDirs = glob.sync(workspace, {
          cwd: medusaLocation.toString(),
        })
        monoRepoPackagesDirs.push(...workspacePackageDirs)
      }
    } catch (err) {
      console.error(
        `Unable to read and parse the workspace definition from medusa package.json`
      )
      process.exit(1)
    }

    // get list of packages from monorepo
    const packageNameToPath = new Map()
    const monoRepoPackages = monoRepoPackagesDirs.map((dirName) => {
      try {
        const localPkg = JSON.parse(
          fs.readFileSync(path.join(medusaLocation, dirName, `package.json`))
        )

        if (localPkg?.name) {
          packageNameToPath.set(
            localPkg.name,
            path.join(medusaLocation, dirName)
          )
          return localPkg.name
        }
      } catch (error) {
        // fallback to generic one
      }

      packageNameToPath.set(dirName, path.join(medusaLocation, dirName))
      return dirName
    })

    const localPkg = JSON.parse(fs.readFileSync(`package.json`))
    // intersect dependencies with monoRepoPackages to get list of packages that are used
    const localPackages = _.intersection(
      monoRepoPackages,
      Object.keys(_.merge({}, localPkg.dependencies, localPkg.devDependencies))
    )

    if (!argv.packages && _.isEmpty(localPackages)) {
      console.error(
        `
You haven't got any medusa dependencies into your current package.json
You probably want to pass in a list of packages to start
developing on! For example:
medusa-dev --packages medusa medusa-js
If you prefer to place them in your package.json dependencies instead,
medusa-dev will pick them up.
`
      )
      if (!argv.forceInstall) {
        process.exit()
      } else {
        console.log(
          `Continuing other dependencies installation due to "--forceInstall" flag`
        )
      }
    }

    watch(medusaLocation, argv.packages, {
      localPackages,
      quiet: argv.quiet,
      scanOnce: argv.scanOnce,
      forceInstall: argv.forceInstall,
      monoRepoPackages,
      packageNameToPath,
      externalRegistry: argv.externalRegistry,
    })
  },
})

buildFFCli(cli)

cli.parse(process.argv.slice(2))

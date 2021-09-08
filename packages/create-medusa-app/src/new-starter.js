import { execSync } from "child_process"
import execa from "execa"
import { spin } from "tiny-spin"
import { sync as existsSync } from "fs-exists-cached"
import fs from "fs-extra"
import hostedGitInfo from "hosted-git-info"
import isValid from "is-valid-path"
import sysPath from "path"
import url from "url"

import { reporter } from "./reporter"
import { getConfigStore } from "./get-config-store"

const packageManagerConfigKey = `cli.packageManager`

export const getPackageManager = (npmConfigUserAgent) => {
  const configStore = getConfigStore()
  const actualPackageManager = configStore.get(packageManagerConfigKey)

  if (actualPackageManager) {
    return actualPackageManager
  }

  if (npmConfigUserAgent?.includes(`yarn`)) {
    configStore.set(packageManagerConfigKey, `yarn`)
    return `yarn`
  }

  configStore.set(packageManagerConfigKey, `npm`)
  return `npm`
}

const removeUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  )
}

const spawnWithArgs = (file, args, options) =>
  execa(file, args, { stdio: "ignore", preferLocal: false, ...options })

const spawn = (cmd, options) => {
  const [file, ...args] = cmd.split(/\s+/)
  return spawnWithArgs(file, args, options)
}
// Checks the existence of yarn package
// We use yarnpkg instead of yarn to avoid conflict with Hadoop yarn
// Refer to https://github.com/yarnpkg/yarn/issues/673
const checkForYarn = () => {
  try {
    execSync(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (e) {
    return false
  }
}

const isAlreadyGitRepository = async () => {
  try {
    return await spawn(`git rev-parse --is-inside-work-tree`, {
      stdio: `pipe`,
    }).then((output) => output.stdout === `true`)
  } catch (err) {
    return false
  }
}

// Initialize newly cloned directory as a git repo
const gitInit = async (rootPath) => {
  reporter.info(`Initialising git in ${rootPath}`)

  return await spawn(`git init`, { cwd: rootPath })
}

// Create a .gitignore file if it is missing in the new directory
const maybeCreateGitIgnore = async (rootPath) => {
  if (existsSync(sysPath.join(rootPath, `.gitignore`))) {
    return
  }

  reporter.info(`Creating minimal .gitignore in ${rootPath}`)
  await fs.writeFile(
    sysPath.join(rootPath, `.gitignore`),
    `.cache\nnode_modules\npublic\n`
  )
  reporter.success(`Created .gitignore in ${rootPath}`)
}

// Create an initial git commit in the new directory
const createInitialGitCommit = async (rootPath, starterUrl) => {
  reporter.info(`Create initial git commit in ${rootPath}`)

  await spawn(`git add -A`, { cwd: rootPath })
  // use execSync instead of spawn to handle git clients using
  // pgp signatures (with password)
  try {
    execSync(`git commit -m "Initial commit from medusa: (${starterUrl})"`, {
      cwd: rootPath,
    })
  } catch {
    // Remove git support if initial commit fails
    reporter.warn(`Initial git commit failed - removing git support\n`)
    fs.removeSync(sysPath.join(rootPath, `.git`))
  }
}

// Executes `npm install` or `yarn install` in rootPath.
const install = async (rootPath, verbose) => {
  const prevDir = process.cwd()

  const stop = spin(`Installing packages...`)
  console.log() // Add some space

  process.chdir(rootPath)

  const npmConfigUserAgent = process.env.npm_config_user_agent

  try {
    if (getPackageManager() === `yarn` && checkForYarn()) {
      await fs.remove(`package-lock.json`)
      await spawn(`yarnpkg`, { stdio: verbose ? `inherit` : `ignore` })
    } else {
      await fs.remove(`yarn.lock`)
      await spawn(`npm install`, { stdio: verbose ? `inherit` : `ignore` })
    }
  } finally {
    stop()
    console.log()
    reporter.success(`Packages installed`)
    process.chdir(prevDir)
  }
}

const ignored = (path) => !/^\.(git|hg)$/.test(sysPath.basename(path))

// Copy starter from file system.
const copy = async (starterPath, rootPath) => {
  // Chmod with 755.
  // 493 = parseInt('755', 8)
  await fs.ensureDir(rootPath, { mode: 493 })

  if (!existsSync(starterPath)) {
    throw new Error(`starter ${starterPath} doesn't exist`)
  }

  if (starterPath === `.`) {
    throw new Error(
      `You can't create a starter from the existing directory. If you want to
      create a new project in the current directory, the trailing dot isn't
      necessary. If you want to create a project from a local starter, run
      something like "medusa new my-medusa-store ../local-medusa-starter"`
    )
  }

  const stop = spin(`Creating new site from local starter: ${starterPath}`)

  reporter.info(`Copying local starter to ${rootPath} ...`)

  await fs.copy(starterPath, rootPath, { filter: ignored })

  stop()
  console.log()
  reporter.success(`Created starter directory layout`)
  console.log() // Add some space

  await install(rootPath)

  return true
}

// Clones starter from URI.
const clone = async (hostInfo, rootPath, keepGit, verbose = false) => {
  let url
  // Let people use private repos accessed over SSH.
  if (hostInfo.getDefaultRepresentation() === `sshurl`) {
    url = hostInfo.ssh({ noCommittish: true })
    // Otherwise default to normal git syntax.
  } else {
    url = hostInfo.https({ noCommittish: true, noGitPlus: true })
  }

  const branch = hostInfo.committish ? [`-b`, hostInfo.committish] : []

  const stop = spin(`Creating new project from git: ${url}`)

  const args = [
    `clone`,
    ...branch,
    url,
    rootPath,
    `--recursive`,
    `--depth=1`,
  ].filter((arg) => Boolean(arg))

  await execa(`git`, args, {})
    .then(() => {
      stop()
      console.log()
      reporter.success(`Created starter directory layout`)
    })
    .catch((err) => {
      stop()
      console.log()
      reporter.error(`Failed to clone repository`)
      throw err
    })

  if (!keepGit) {
    await fs.remove(sysPath.join(rootPath, `.git`))
  }

  await install(rootPath, verbose)
  const isGit = await isAlreadyGitRepository()
  if (!isGit) await gitInit(rootPath)
  await maybeCreateGitIgnore(rootPath)
  if (!isGit) await createInitialGitCommit(rootPath, url)
}

const getMedusaConfig = (rootPath) => {
  try {
    const configPath = sysPath.join(rootPath, "medusa-config.js")
    if (existsSync(configPath)) {
      const resolved = sysPath.resolve(configPath)
      const configModule = require(resolved)
      return configModule
    }
    throw Error()
  } catch (err) {
    return null
  }
  return {}
}

const getPaths = async (starterPath, rootPath) => {
  let selectedOtherStarter = false

  // set defaults if no root or starter has been set yet
  rootPath = rootPath || process.cwd()
  starterPath = starterPath || `medusajs/medusa-starter-default`

  return { starterPath, rootPath, selectedOtherStarter }
}

const successMessage = (path) => {
  reporter.info(`Your new Medusa project is ready for you! To start developing run:

  cd ${path}
  medusa develop
`)
}

const setupEnvVars = async (rootPath) => {
  const templatePath = sysPath.join(rootPath, ".env.template")
  const destination = sysPath.join(rootPath, ".env")
  if (existsSync(templatePath)) {
    fs.renameSync(templatePath, destination)
  }
}

const attemptSeed = async (rootPath) => {
  const stop = spin("Seeding database")

  const pkgPath = sysPath.resolve(rootPath, "package.json")
  if (existsSync(pkgPath)) {
    const pkg = require(pkgPath)
    if (pkg.scripts && pkg.scripts.seed) {
      await setupEnvVars(rootPath)

      const proc = execa(getPackageManager(), [`run`, `seed`], {
        cwd: rootPath,
      })

      // Useful for development
      proc.stdout.pipe(process.stdout)

      await proc
        .then(() => {
          stop()
          console.log()
          reporter.success("Seed completed")
        })
        .catch((err) => {
          stop()
          console.log()
          reporter.error("Failed to complete seed; skipping")
          console.error(err)
        })
    } else {
      stop()
      console.log()
      reporter.error("Starter doesn't provide a seed command; skipping.")
    }
  } else {
    stop()
    console.log()
    reporter.error("Could not find package.json")
  }
}

/**
 * Main function that clones or copies the starter.
 */
export const newStarter = async (args) => {
  const { starter, root, verbose, seed, keepGit } = args

  const { starterPath, rootPath, selectedOtherStarter } = await getPaths(
    starter,
    root
  )

  const urlObject = url.parse(rootPath)

  if (urlObject.protocol && urlObject.host) {
    const isStarterAUrl =
      starter && !url.parse(starter).hostname && !url.parse(starter).protocol

    if (/medusa-starter/gi.test(rootPath) && isStarterAUrl) {
      reporter.panic({
        id: `10000`,
        context: {
          starter,
          rootPath,
        },
      })
      return
    }
    reporter.panic({
      id: `10001`,
      context: {
        rootPath,
      },
    })
    return
  }

  if (!isValid(rootPath)) {
    reporter.panic({
      id: `10002`,
      context: {
        path: sysPath.resolve(rootPath),
      },
    })
    return
  }

  if (existsSync(sysPath.join(rootPath, `package.json`))) {
    reporter.panic({
      id: `10003`,
      context: {
        rootPath,
      },
    })
    return
  }

  const hostedInfo = hostedGitInfo.fromUrl(starterPath)
  if (hostedInfo) {
    await clone(hostedInfo, rootPath, keepGit, verbose)
  } else {
    await copy(starterPath, rootPath, verbose)
  }

  const medusaConfig = getMedusaConfig(rootPath)
  if (medusaConfig) {
    let isPostgres = false
    if (medusaConfig.projectConfig) {
      const databaseType = medusaConfig.projectConfig.database_type
      isPostgres = databaseType === "postgres"
    }

    if (!isPostgres && seed) {
      await attemptSeed(rootPath)
    }
  }
}

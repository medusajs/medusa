import Commander from "commander"
import path from "path"

import { prompt } from "enquirer"
import { newStarter } from "./new-starter"
import { track } from "./track"

import pkg from "../package.json"

let projectPath: string = ""

const questions = {
  projectRoot: {
    type: "input",
    name: "projectRoot",
    message: "Where should your project be installed?",
    initial: "my-medusa-store",
  },
  starter: {
    type: "select",
    name: "starter",
    message: "Which Medusa starter would you like to install?",
    choices: ["medusa-starter-default", "medusa-starter-contentful", "Other"],
  },
  starterUrl: {
    type: "input",
    name: "starterUrl",
    message: "Where is the starter located? (URL or path)",
  },
  storefront: {
    type: "select",
    name: "storefront",
    message: "Which storefront starter would you like to install?",
    choices: [
      "Next.js Starter",
      "medusa.express (Next.js)",
      "None",
    ],
  },
}

const program = new Commander.Command(pkg.name)
  .version(pkg.version)
  .action((name) => (projectPath = name))
  .option(`-r --root`, `The directory to install your Medusa app`)
  .option(
    `-s --starter-url`,
    `A GitHub URL to a repository that contains a Medusa starter project to bootstrap from`
  )
  .option(
    `--no-seed`,
    `If run with the no-seed flag the script will skip seeding the database upon setup`
  )
  .option(`-v --verbose`, `Show all installation output`)
  .parse(process.argv)

const getStorefrontStarter = (starter: string): string => {
  const selected = starter.toLowerCase()
  switch (selected) {
    case "next.js starter":
      return "https://github.com/medusajs/nextjs-starter-medusa"
    case "medusa.express (next.js)":
      return "https://github.com/medusajs/medusa-express-nextjs"
    default:
      return ""
  }
}

export const run = async (): Promise<void> => {
  track("CREATE_CLI")

  if (typeof projectPath === "string") {
    projectPath = projectPath.trim()
  }

  const { projectRoot } = (await prompt(questions.projectRoot)) as {
    projectRoot: string
  }
  let { starter } = (await prompt(questions.starter)) as {
    starter: string
  }

  if (starter === "Other") {
    const { starterUrl } = (await prompt(questions.starterUrl)) as {
      starterUrl: string
    }
    starter = starterUrl
  } else {
    starter = `medusajs/${starter}`
  }
  track("STARTER_SELECTED", { starter })

  const progOptions = program.opts()

  const noSeed = progOptions.noSeed
  track("SEED_SELECTED", { seed: !noSeed })

  const { storefront } = (await prompt(questions.storefront)) as {
    storefront: string
  }
  track("STOREFRONT_SELECTED", { storefront })

  await newStarter({
    starter,
    root: path.join(projectRoot, `backend`),
    seed: !noSeed,
    verbose: progOptions.verbose,
  })

  const hasStorefront = storefront.toLowerCase() !== "none"
  if (hasStorefront) {
    const storefrontStarter = getStorefrontStarter(storefront)
    await newStarter({
      starter: storefrontStarter,
      root: path.join(projectRoot, `storefront`),
      verbose: progOptions.verbose,
    })
  }

  console.log(`
  Your project is ready 🚀. The available commands are:
  
    Medusa API
    cd ${projectRoot}/backend
    yarn start
  `)

  if (hasStorefront) {
    console.log(`
    Storefront
    cd ${projectRoot}/storefront
    yarn dev
    `)
  }
}

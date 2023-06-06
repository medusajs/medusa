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

  const { storefront } = (await prompt(questions.storefront)) as {
    storefront: string
  }
  track("STOREFRONT_SELECTED", { storefront })

  await newStarter({
    starter,
    root: path.join(projectRoot, `backend`),
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
  Your project is ready 🚀. To start your Medusa project:
  
    Medusa Backend
    1. Change to the backend directory: cd ${projectRoot}/backend
    2. Create a PostgreSQL database and make sure your PostgreSQL server is running.
    3. Add the following environment variable to the \`.env\` file:
        DATABASE_URL=postgres://localhost/medusa-store # This is the default URL, change it to your own database URL
    4. Run migrations:
        npx @medusajs/medusa-cli@latest migrations run
    5. Optionally seed database with dummy data:
        npx @medusajs/medusa-cli@latest seed -f ./data/seed.json
    6. Start backend:
        npx @medusajs/medusa-cli@latest develop
  `)

  if (hasStorefront) {
    console.log(`
    Storefront
    1. Run the backend as explained above.
    2. Change to the storefront directory: cd ${projectRoot}/storefront
    3. Run storefront: yarn dev
    `)
  }
}

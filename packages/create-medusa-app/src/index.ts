import Commander from "commander"
import chalk from "chalk"

import Enquirer from "enquirer"
import { newStarter } from "./new-starter"

import pkg from "../package.json"

let projectPath: string = ""

interface CreateCLI {
  starterUrl?: string
  seed?: boolean
}

const program = <CreateCLI>new Commander.Command(pkg.name)
  .version(pkg.version)
  .arguments(`<directory>`)
  .usage(`${chalk.green("<directory>")} [options]`)
  .action((name) => (projectPath = name))
  .option(
    `-s --starter-url`,
    `A GitHub URL to a repository that contains a Medusa starter project to bootstrap from`
  )
  .option(
    `--seed`,
    `If run with the seed flag the script will automatically attempt to seed the database upon setup`
  )
  .parse(process.argv)

export const run = async (): Promise<void> => {
  if (typeof projectPath === "string") {
    projectPath = projectPath.trim()
  }

  return await newStarter({
    starter: program.starterUrl,
    root: projectPath,
    seed: program.seed,
  })
}

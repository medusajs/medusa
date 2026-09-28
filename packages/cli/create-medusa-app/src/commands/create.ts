import { intro } from "@clack/prompts"
import chalk from "chalk"
import {
  ProjectCreatorFactory,
  ProjectOptions,
} from "../utils/project-creator/index.js"

/**
 * Command handler to create a Medusa project or plugin
 */
export default async (args: string[], options: ProjectOptions) => {
  intro(chalk.inverse(" create-medusa-app "))

  const projectCreator = await ProjectCreatorFactory.create(args, options)
  await projectCreator.create({
    verbose: options.verbose,
  })
}

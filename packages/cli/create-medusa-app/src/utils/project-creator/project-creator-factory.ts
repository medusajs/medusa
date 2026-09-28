import fs from "fs"
import { text } from "@clack/prompts"
import path from "path"
import slugifyType from "slugify"
import exitOnCancel from "../exit-on-cancel.js"
import logMessage from "../log-message.js"
import { ProjectCreator, ProjectOptions } from "./creator.js"
import { PluginProjectCreator } from "./medusa-plugin-creator.js"
import { MedusaProjectCreator } from "./medusa-project-creator.js"

const slugify = slugifyType.default

export class ProjectCreatorFactory {
  static async create(
    args: string[],
    options: ProjectOptions
  ): Promise<ProjectCreator> {
    const projectName = await ProjectCreatorFactory.getProjectName(
      args,
      options.directoryPath,
      options.plugin
    )

    return options.plugin
      ? new PluginProjectCreator(projectName, options, args)
      : new MedusaProjectCreator(projectName, options, args)
  }

  private static async getProjectName(
    args: string[],
    directoryPath?: string,
    isPlugin?: boolean
  ): Promise<string> {
    let askProjectName = args.length === 0
    if (args.length > 0) {
      const projectPath = path.join(directoryPath || "", args[0])
      if (
        fs.existsSync(projectPath) &&
        fs.lstatSync(projectPath).isDirectory()
      ) {
        logMessage({
          message: `A directory already exists with the name ${
            args[0]
          }. Please enter a different ${isPlugin ? "plugin" : "project"} name.`,
          type: "warn",
        })
        askProjectName = true
      } else if (args[0].includes(".")) {
        // We don't allow projects to have a dot in the name, as this causes issues for
        // for MikroORM path resolutions.
        logMessage({
          message: `Project names cannot contain a dot (.) character. Please enter a different ${
            isPlugin ? "plugin" : "project"
          } name.`,
          type: "error",
        })
        askProjectName = true
      }
    }

    return askProjectName
      ? await askForProjectName(directoryPath, isPlugin)
      : args[0]
  }
}

async function askForProjectName(
  directoryPath?: string,
  isPlugin?: boolean
): Promise<string> {
  const projectType = isPlugin ? "plugin" : "project"
  const defaultName = isPlugin ? "my-medusa-plugin" : "my-medusa-store"
  const formatName = (input?: string) =>
    slugify(input || defaultName).toLowerCase()

  const projectName = exitOnCancel(
    await text({
      message: `What's the name of your ${projectType}?`,
      placeholder: defaultName,
      defaultValue: defaultName,
      validate: (input) => {
        const name = formatName(input)
        // We don't allow projects to have a dot in the name, as this causes issues for
        // for MikroORM path resolutions.
        if (name.includes(".")) {
          return `Project names cannot contain a dot (.) character. Please enter a different ${projectType} name.`
        }

        const projectPath = path.join(directoryPath || "", name)
        if (
          fs.existsSync(projectPath) &&
          fs.lstatSync(projectPath).isDirectory()
        ) {
          return `A directory already exists with the same name. Please enter a different ${projectType} name.`
        }
      },
    })
  )

  return formatName(projectName)
}

import fs from "fs"
import inquirer from "inquirer"
import path from "path"
import slugifyType from "slugify"
import logMessage from "../log-message.js"
import { getNodeVersion, MIN_SUPPORTED_NODE_VERSION } from "../node-version.js"
import { ProjectCreator, ProjectOptions } from "./creator.js"
import { PluginProjectCreator } from "./medusa-plugin-creator.js"
import { MedusaProjectCreator } from "./medusa-project-creator.js"
import terminalLink from "terminal-link"

const slugify = slugifyType.default

export class ProjectCreatorFactory {
  static async create(
    args: string[],
    options: ProjectOptions
  ): Promise<ProjectCreator> {
    ProjectCreatorFactory.validateNodeVersion()

    const projectName = await ProjectCreatorFactory.getProjectName(
      args,
      options.directoryPath,
      options.plugin
    )

    return options.plugin
      ? new PluginProjectCreator(projectName, options, args)
      : new MedusaProjectCreator(projectName, options, args)
  }

  private static validateNodeVersion(): void {
    const nodeVersion = getNodeVersion()
    if (nodeVersion < MIN_SUPPORTED_NODE_VERSION) {
      logMessage({
        message: `Medusa requires at least v20 of Node.js. You're using v${nodeVersion}. Please ${terminalLink(
          "install Node.js",
          "https://nodejs.org/en/download"
        )} at least v20 and try again.`,
        type: "error",
      })
    }
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
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: `What's the name of your ${isPlugin ? "plugin" : "project"}?`,
      default: isPlugin ? "my-medusa-plugin" : "my-medusa-store",
      filter: (input) => {
        return slugify(input).toLowerCase()
      },
      validate: (input) => {
        // We don't allow projects to have a dot in the name, as this causes issues for
        // for MikroORM path resolutions.
        if (input.includes(".")) {
          return `Project names cannot contain a dot (.) character. Please enter a different ${
            isPlugin ? "plugin" : "project"
          } name.`
        }

        if (!input.length) {
          return `Please enter a ${isPlugin ? "plugin" : "project"} name`
        }
        const projectPath = path.join(directoryPath || "", input)
        return fs.existsSync(projectPath) &&
          fs.lstatSync(projectPath).isDirectory()
          ? `A directory already exists with the same name. Please enter a different ${
              isPlugin ? "plugin" : "project"
            } name.`
          : true
      },
    },
  ])
  return projectName
}

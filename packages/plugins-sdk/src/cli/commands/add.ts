import type { ExtensionType } from "@medusajs/types"
import fse from "fs-extra"
import inquirer from "inquirer"
import path from "path"

export default async function add(): Promise<void> {
  const extensionPath = process.cwd()
  const packagePath = path.resolve("package.json")

  if (!(await fse.pathExists(packagePath))) {
    console.log("Current directory is not a valid package")
    process.exit(1)
  }

  const sourceExists = await fse.pathExists(path.resolve("src"))

  const { type, name, language } = await inquirer.prompt<{
    type: ExtensionType
    name: string
    language: "ts" | "js"
  }>([
    {
      type: "list",
      name: "type",
      message: "What type of extension do you want to add?",
      choices: [
        {
          value: "api",
          name: "Endpoint",
        },
        {
          value: "subscribers",
          name: "Subscriber",
        },
        {
          value: "services",
          name: "Service",
        },
        {
          value: "loaders",
          name: "Loader",
        },
        {
          value: "migrations",
          name: "Migration",
        },
        {
          value: "models",
          name: "Model",
        },
        {
          value: "ui",
          name: "UI",
        },
      ] as { value: ExtensionType; name: string }[],
    },
    {
      type: "input",
      name: "name",
      message: "What is the name of the extension?",
    },
    {
      type: "list",
      name: "language",
      message: "What language do you want to use?",
      choices: [
        {
          value: "ts",
          name: "TypeScript",
        },
        {
          value: "js",
          name: "JavaScript",
        },
      ],
    },
  ])

  await fse.ensureDir("")
}

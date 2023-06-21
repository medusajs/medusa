import log from "../utils/logger.js"
import { resolve } from "path"
import { writeFile } from "fs/promises"
import { spinner } from "../index.js"
import dedent from "dedent"

const fileName = ".gitignore"

export async function generateGitIgnore({
  modulePath,
}: {
  modulePath: string
}): Promise<void> {
  log(`Generating ${fileName}`)

  const template = dedent`
  /dist
  node_modules
  .DS_store
  .env*
  .env
  *.sql
  `

  try {
    const path = resolve(modulePath, fileName)
    await writeFile(path, template)
    spinner.succeed(`${fileName} generated`)
  } catch (error) {
    log(`Failed to generate ${fileName}`, "error")
    throw error
  }
}

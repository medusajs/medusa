import log from "../utils/logger.js"
import { resolve } from "path"
import { writeFile } from "fs/promises"
import { spinner } from "../index.js"
import dedent from "dedent"

const fileName = "mikro-orm.config.dev.ts"

export async function generateMikroOrmConfigDev({
  modulePath,
}: {
  modulePath: string
}): Promise<void> {
  log(`Generating ${fileName}`)

  const template = dedent`
  import * as entities from "./src/models"

  module.exports = {
    entities: Object.values(entities ?? {}),
    schema: "public",
    clientUrl: "postgres://postgres@localhost/medusa-products",
    type: "postgresql",
  }
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

import { join } from "path"
import { CustomDirectives, makeSchemaExecutable } from "./build-config"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  FileSystem,
  gqlSchemaToTypes as ModulesSdkGqlSchemaToTypes,
} from "@medusajs/framework/utils"
import * as process from "process"

export async function gqlSchemaToTypes(schema: string) {
  const augmentedSchema = CustomDirectives.Listeners.definition + schema
  const executableSchema = makeSchemaExecutable(augmentedSchema)
  const filename = "index-service-entry-points"
  const filenameWithExt = filename + ".d.ts"
  const dir = join(process.cwd(), ".medusa")

  await ModulesSdkGqlSchemaToTypes({
    schema: executableSchema,
    filename,
    interfaceName: "IndexServiceEntryPoints",
    outputDir: dir,
    joinerConfigs: MedusaModule.getAllJoinerConfigs(),
  })

  const fileSystem = new FileSystem(dir)
  let content = await fileSystem.contents(filenameWithExt)

  await fileSystem.remove(filenameWithExt)

  const entryPoints = buildEntryPointsTypeMap(content)

  const indexEntryPoints = `
declare module '@medusajs/framework/types' {
  interface IndexServiceEntryPoints  {
${entryPoints
  .map((entry) => `    ${entry.entryPoint}: ${entry.entityType}`)
  .join("\n")}
  }
}`

  const contentToReplaceMatcher = new RegExp(
    `declare\\s+module\\s+['"][^'"]+['"]\\s*{([^}]*?)}\\s+}`,
    "gm"
  )
  content = content.replace(contentToReplaceMatcher, indexEntryPoints)

  await fileSystem.create(filenameWithExt, content)
}

function buildEntryPointsTypeMap(
  schema: string
): { entryPoint: string; entityType: any }[] {
  // build map entry point to there type to be merged and used by the remote query

  const joinerConfigs = MedusaModule.getAllJoinerConfigs()
  return joinerConfigs
    .flatMap((config) => {
      const aliases = Array.isArray(config.alias)
        ? config.alias
        : config.alias
        ? [config.alias]
        : []

      return aliases.flatMap((alias) => {
        const names = Array.isArray(alias.name) ? alias.name : [alias.name]
        const entity = alias?.["entity"]
        return names.map((aliasItem) => {
          if (!schema.includes(`export type ${entity} `)) {
            return
          }

          return {
            entryPoint: aliasItem,
            entityType: entity
              ? schema.includes(`export type ${entity} `)
                ? alias?.["entity"]
                : "any"
              : "any",
          }
        })
      })
    })
    .filter(Boolean) as { entryPoint: string; entityType: any }[]
}

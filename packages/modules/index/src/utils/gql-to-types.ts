import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  FileSystem,
  GraphQLUtils,
  gqlSchemaToTypes as ModulesSdkGqlSchemaToTypes,
} from "@medusajs/framework/utils"
import { randomUUID } from "crypto"
import { rename } from "fs/promises"
import { join } from "path"
import * as process from "process"

export async function gqlSchemaToTypes(
  executableSchema: GraphQLUtils.GraphQLSchema
) {
  const filename = "index-service-entry-points"
  const filenameWithExt = filename + ".d.ts"
  const dir = join(process.cwd(), ".medusa/types")

  await ModulesSdkGqlSchemaToTypes({
    schema: executableSchema,
    filename,
    interfaceName: "IndexServiceEntryPoints",
    outputDir: dir,
    joinerConfigs: MedusaModule.getAllJoinerConfigs(),
  })

  const fileSystem = new FileSystem(dir)
  let content = await fileSystem.contents(filenameWithExt)

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

  // Write through a unique temp file and rename it so that concurrent
  // processes sharing the same cwd never observe a missing file
  const tmpFilename = `${filenameWithExt}.${process.pid}-${randomUUID()}.tmp`
  await fileSystem.create(tmpFilename, content)
  await rename(join(dir, tmpFilename), join(dir, filenameWithExt)).catch(
    async (e) => {
      await fileSystem.remove(tmpFilename)
      throw e
    }
  )
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

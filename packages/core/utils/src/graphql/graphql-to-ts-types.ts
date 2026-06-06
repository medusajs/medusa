import { codegen } from "@graphql-codegen/core"
import * as typescriptPlugin from "@graphql-codegen/typescript"
import { ModuleJoinerConfig } from "@zjedene-medusa/types"
import {
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
  type GraphQLSchema,
  Kind,
  parse,
  printSchema,
} from "graphql"
import { FileSystem } from "../common"

function buildEntryPointsTypeMap({
  schema,
  joinerConfigs,
}: {
  schema: string
  joinerConfigs: ModuleJoinerConfig[]
}): { entryPoint: string; entityType: any }[] {
  // build map entry point to there type to be merged and used by the remote query

  return joinerConfigs.flatMap((config) => {
    const aliases = Array.isArray(config.alias)
      ? config.alias
      : config.alias
      ? [config.alias]
      : []

    return aliases
      .flatMap((alias) => {
        const names = Array.isArray(alias.name) ? alias.name : [alias.name]
        const entity = alias?.["entity"]
        return names.map((aliasItem) => {
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
      .filter(Boolean)
  })
}

async function generateTypes({
  outputDir,
  filename,
  interfaceName,
  config,
  joinerConfigs,
}: {
  outputDir: string
  filename: string
  interfaceName: string
  config: Parameters<typeof codegen>[0]
  joinerConfigs: ModuleJoinerConfig[]
}) {
  const fileSystem = new FileSystem(outputDir)

  let output = 'import "@zjedene-medusa/framework/types"\n'
  output += await codegen(config)
  const entryPoints = buildEntryPointsTypeMap({ schema: output, joinerConfigs })

  const remoteQueryEntryPoints = `
declare module '@zjedene-medusa/framework/types' {
  interface ${interfaceName} {
${entryPoints
  .map((entry) => `    ${entry.entryPoint}: ${entry.entityType}`)
  .join("\n")}
  }
}`

  output += remoteQueryEntryPoints

  const barrelFileName = "index.d.ts"
  await fileSystem.create(filename + ".d.ts", output)

  const doesBarrelExists = await fileSystem.exists(barrelFileName)
  if (!doesBarrelExists) {
    await fileSystem.create(
      barrelFileName,
      `export * as ${interfaceName}Types from './${filename}'`
    )
  } else {
    const content = await fileSystem.contents(barrelFileName)
    if (!content.includes(`${interfaceName}Types`)) {
      const newContent = `export * as ${interfaceName}Types from './${filename}'\n${content}`
      await fileSystem.create(barrelFileName, newContent)
    }
  }
}

const getEnumValues = (schema: GraphQLSchema) => {
  const enumTypes = Object.values(schema.getTypeMap()).filter(
    (type) => type.astNode?.kind === Kind.ENUM_TYPE_DEFINITION
  )

  const enumValues = {}
  enumTypes.forEach((type) => {
    const enumName = type.name
    enumValues[enumName] = {}

    const nodes = (type.astNode as EnumTypeDefinitionNode).values || []
    nodes.forEach((node: EnumValueDefinitionNode) => {
      const directive = node.directives?.find(
        (d) => d.name.value === "enumValue"
      )
      if (directive) {
        const valueArg = directive.arguments?.find(
          (a) => a.name.value === "value"
        )
        if (valueArg && valueArg.value.kind === Kind.STRING) {
          enumValues[enumName][node.name.value] = valueArg.value.value
        }
      }
    })
  })

  return enumValues
}

// TODO: rename from gqlSchemaToTypes to grapthqlToTsTypes
export async function gqlSchemaToTypes({
  schema,
  outputDir,
  filename,
  joinerConfigs,
  interfaceName,
}: {
  schema: GraphQLSchema
  outputDir: string
  filename: string
  joinerConfigs: ModuleJoinerConfig[]
  interfaceName: string
}) {
  const config = {
    documents: [],
    config: {
      scalars: {
        DateTime: { input: "Date | string", output: "Date | string" },
        JSON: {
          input: "Record<string, unknown>",
          output: "Record<string, unknown>",
        },
      },
      avoidOptionals: {
        field: true, // Avoid optional fields in types
      },
    },
    filename: "",
    schema: parse(printSchema(schema as any)),
    plugins: [
      {
        typescript: {
          enumValues: getEnumValues(schema),
          enumsAsTypes: true,
        },
      },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
    },
  }

  await generateTypes({
    outputDir,
    filename,
    config,
    joinerConfigs,
    interfaceName,
  })
}

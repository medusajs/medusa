import {
  isValidCustomFieldDisplayPath,
  isValidCustomFieldDisplayZone,
} from "@medusajs/admin-shared"
import * as fs from "fs/promises"
import {
  ExportDefaultDeclaration,
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  NodePath,
  ObjectProperty,
  parse,
  traverse,
} from "../babel"
import { CustomFieldDisplayPath } from "../types"
import {
  convertToImportPath,
  crawl,
  generateModule,
  getParserOptions,
} from "../utils"
import { getModel } from "./helpers"

function getDisplayArray(path: NodePath<ExportDefaultDeclaration>) {
  if (!isCallExpression(path.node.declaration)) {
    return null
  }

  if (
    !isIdentifier(path.node.declaration.callee, {
      name: "defineCustomFieldsConfig",
    })
  ) {
    return null
  }

  const configArgument = path.node.declaration.arguments[0]

  if (!isObjectExpression(configArgument)) {
    return null
  }

  const displayProperty = configArgument.properties.find((p) => {
    return isObjectProperty(p) && isIdentifier(p.key, { name: "display" })
  }) as ObjectProperty | undefined

  if (!displayProperty || !isArrayExpression(displayProperty.value)) {
    return null
  }

  return displayProperty.value
}

function validateCustomFieldDisplayConfig(
  path: NodePath<ExportDefaultDeclaration>,
  displayPath?: CustomFieldDisplayPath
) {
  let hasOneValidDisplay = false
  const paths: Set<string> = new Set()
  const validIndexes: Set<number> = new Set()

  const { model, valid: isModelValid } = getModel(path, displayPath?.model)

  if (!isModelValid) {
    return { valid: hasOneValidDisplay, paths: null, validIndexes: [] }
  }

  const displayArray = getDisplayArray(path)

  if (!displayArray) {
    return { valid: hasOneValidDisplay, paths: null, validIndexes: [] }
  }

  displayArray.elements.forEach((element, index) => {
    if (!isObjectExpression(element)) {
      return
    }

    const zoneProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "zone" })
    ) as ObjectProperty | undefined

    const componentProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "component" })
    ) as ObjectProperty | undefined

    if (!zoneProperty || !componentProperty) {
      return
    }

    if (!isStringLiteral(zoneProperty.value)) {
      return
    }

    const zone = zoneProperty.value.value

    if (
      !isValidCustomFieldDisplayZone(zone) ||
      (displayPath && zone !== displayPath.zone)
    ) {
      return
    }

    const fullPath = `${model}.${zone}.$display`

    if (!isValidCustomFieldDisplayPath(fullPath)) {
      return
    }

    hasOneValidDisplay = true
    paths.add(zone)
    validIndexes.add(index)
  })

  const _paths = paths.size > 0 ? Array.from(paths) : null
  const validIndexesArray = Array.from(validIndexes)
  return {
    valid: hasOneValidDisplay,
    paths: _paths,
    validIndexes: validIndexesArray.length > 0 ? validIndexesArray : null,
  }
}

export async function validateCustomFieldDisplay(
  file: string,
  displayPath?: CustomFieldDisplayPath
): Promise<
  | { valid: true; paths: string[]; indexes: number[] }
  | { valid: false; paths: null; indexes: null }
> {
  try {
    const content = await fs.readFile(file, "utf-8")
    const parserOptions = getParserOptions(file)
    const ast = parse(content, parserOptions)

    let result: {
      valid: boolean
      paths: string[] | null
      indexes: number[] | null
    } = { valid: false, paths: null, indexes: null }

    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const { valid, paths, validIndexes } = validateCustomFieldDisplayConfig(
          path,
          displayPath
        )

        result = {
          valid: valid,
          paths: paths,
          indexes: validIndexes,
        }
      },
    })

    if (result.valid && result.paths && result.indexes) {
      return {
        valid: result.valid,
        paths: result.paths,
        indexes: result.indexes,
      }
    }
  } catch (err) {
    // noop - TODO: Implement proper logging to inform the user that we weren't able to traverse the file
  }

  return { valid: false, paths: null, indexes: null }
}

export async function generateCustomFieldDisplayEntrypoint(
  sources: Set<string>,
  displayPath: CustomFieldDisplayPath
) {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/custom-fields`)
      )
    )
  ).flat()

  const validatedContainers = (
    await Promise.all(
      files.map(async (file) => {
        const { valid, indexes } = await validateCustomFieldDisplay(
          file,
          displayPath
        )
        return valid ? { src: file, indexes } : null
      })
    )
  ).filter(Boolean) as { src: string; indexes: number[] }[]

  if (!validatedContainers.length) {
    const code = `export default {
        containers: [],
      }`

    return { module: generateModule(code), paths: [] }
  }

  const importString = validatedContainers
    .map(({ src }, index) => {
      return `import CustomFieldContainerExt${index} from "${convertToImportPath(
        src
      )}"`
    })
    .join("\n")

  const exportString = `export default {
  containers: [${validatedContainers
    .map(({ indexes }, containerIndex) => {
      return `...((CustomFieldContainerExt${containerIndex}.display || []).filter((_, i) => ${JSON.stringify(
        indexes
      )}.includes(i))
        .map(display => ({
          component: display.component,
        }))
      )`
    })
    .join(", ")}
  ],
}`

  const code = `${importString}\n${exportString}`

  return {
    module: generateModule(code),
    paths: validatedContainers.map(({ src }) => src),
  }
}

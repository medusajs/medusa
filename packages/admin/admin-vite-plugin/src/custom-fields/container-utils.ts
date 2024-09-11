import { ContainerId, isValidContainerId } from "@medusajs/admin-shared"
import * as fs from "fs/promises"
import {
  ExportDefaultDeclaration,
  File,
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  NodePath,
  ObjectProperty,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import {
  convertToImportPath,
  crawl,
  generateModule,
  getParserOptions,
} from "../utils"
import { validateEntrypoint } from "./helpers"

function getContainerProperties(path: NodePath<ExportDefaultDeclaration>) {
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

  if (!displayProperty || !isObjectExpression(displayProperty.value)) {
    return null
  }

  return displayProperty.value.properties
}

function validateCustomFieldContainerConfig(
  path: NodePath<ExportDefaultDeclaration>,
  container?: ContainerId
): { containerIsValid: boolean; containerValue: string | string[] | null } {
  let containerIsValid = false
  let containerValue: string | string[] | null = null

  const isEntrypointMatch = validateEntrypoint(path, container)

  if (!isEntrypointMatch) {
    return { containerIsValid, containerValue }
  }

  const properties = getContainerProperties(path)

  if (!properties) {
    return { containerIsValid, containerValue }
  }

  const containerProperty = properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "container" })
  ) as ObjectProperty | undefined

  if (!containerProperty) {
    return { containerIsValid, containerValue }
  }

  if (isStringLiteral(containerProperty.value)) {
    containerIsValid = !container
      ? isValidContainerId(containerProperty.value.value)
      : container === containerProperty.value.value
    containerValue = containerProperty.value.value
  } else if (isArrayExpression(containerProperty.value)) {
    containerIsValid = containerProperty.value.elements.every((e) => {
      if (!isStringLiteral(e)) {
        return false
      }

      const isContainerMatch = !container ? true : container === e.value

      return isValidContainerId(e.value) && isContainerMatch
    })

    const values: string[] = []

    for (const element of containerProperty.value.elements) {
      if (isStringLiteral(element)) {
        values.push(element.value)
      }
    }

    containerValue = values
  }

  return { containerIsValid, containerValue }
}

export async function validateCustomFieldContainer(
  file: string,
  container?: ContainerId
): Promise<
  { valid: true; container: ContainerId } | { valid: false; container: null }
> {
  let _containerValue: string | string[] | null = null

  const content = await fs.readFile(file, "utf-8")
  const parserOptions = getParserOptions(file)

  let ast: ParseResult<File>

  try {
    ast = parse(content, parserOptions)
  } catch (e) {
    return { valid: false, container: _containerValue }
  }

  let isValid = false

  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const { containerIsValid, containerValue } =
          validateCustomFieldContainerConfig(path, container)
        isValid = containerIsValid
        _containerValue = containerValue
      },
    })
  } catch (err) {
    return { valid: false, container: _containerValue as any }
  }

  return {
    valid: isValid,
    container: _containerValue,
  }
}

export async function generateCustomFieldContainerEntrypoint(
  sources: Set<string>,
  container: ContainerId
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
        const { valid } = await validateCustomFieldContainer(file, container)
        return valid ? file : null
      })
    )
  ).filter(Boolean) as string[]

  if (!validatedContainers.length) {
    const code = `export default {
        blocks: [],
      }`

    return { module: generateModule(code), paths: [] }
  }

  const importString = validatedContainers
    .map((path, index) => {
      return `import ContainerExt${index} from "${convertToImportPath(path)}"`
    })
    .join("\n")

  const exportString = `export default {
        blocks: [${validatedContainers
          .map(
            (_, index) =>
              `{ component: ContainerExt${index}.display.component, extendQuery: ContainerExt${index}.display.extendQuery }`
          )
          .join(", ")}],
    }`

  const code = `${importString}\n${exportString}`

  return { module: generateModule(code), paths: validatedContainers }
}

import { isValidCustomFieldLinkPath } from "@medusajs/admin-shared"
import * as fs from "fs/promises"
import {
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isStringLiteral,
  parse,
  traverse,
  type ExportDefaultDeclaration,
  type NodePath,
} from "../babel"
import { CustomFieldLinkPath } from "../types"
import {
  convertToImportPath,
  crawl,
  generateModule,
  getObjectPropertyValue,
  getParserOptions,
} from "../utils"
import { getModel } from "./helpers"

function getLinkPropery(path: NodePath<ExportDefaultDeclaration>) {
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

  const linkValue = getObjectPropertyValue("link", configArgument.properties)

  if (!isStringLiteral(linkValue) && !isArrayExpression(linkValue)) {
    return null
  }

  return linkValue
}

function validateCustomFieldLinkConfig(
  path: NodePath<ExportDefaultDeclaration>,
  linkPath?: CustomFieldLinkPath
): { valid: true; paths: string[] } | { valid: false; paths: null } {
  const { model, valid: isModelValid } = getModel(path, linkPath?.model)

  if (!isModelValid) {
    return { valid: false, paths: null }
  }

  const linkProperty = getLinkPropery(path)

  if (!linkProperty) {
    return { valid: false, paths: null }
  }

  if (isArrayExpression(linkProperty)) {
    for (const element of linkProperty.elements) {
      if (!isStringLiteral(element)) {
        return { valid: false, paths: null }
      }
    }
  }

  const fullPath = `${model}/$link`

  if (!isValidCustomFieldLinkPath(fullPath)) {
    return { valid: false, paths: null }
  }

  const paths = [fullPath]

  return { valid: true, paths }
}

export async function validateCustomFieldLink(
  file: string,
  linkPath?: CustomFieldLinkPath
): Promise<{ valid: true; paths: string[] } | { valid: false; paths: null }> {
  try {
    const content = await fs.readFile(file, "utf-8")
    const parserOptions = getParserOptions(file)
    const ast = parse(content, parserOptions)

    let result: {
      valid: boolean
      paths: string[] | null
    } = { valid: false, paths: null }

    traverse(ast, {
      ExportDefaultDeclaration(path) {
        result = validateCustomFieldLinkConfig(path, linkPath)
      },
    })

    if (result.valid && result.paths) {
      return { valid: result.valid, paths: result.paths }
    }
  } catch (e) {
    // noop - TODO: Implement proper logging to inform the user that we weren't able to traverse the file
  }

  return { valid: false, paths: null }
}

export async function generateCustomFieldLinkEntrypoint(
  sources: Set<string>,
  linkPath: CustomFieldLinkPath
) {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/custom-fields`)
      )
    )
  ).flat()

  const validatedFields = (
    await Promise.all(
      files.map(async (file) => {
        const isValid = await validateCustomFieldLink(file, linkPath)
        return isValid ? file : null
      })
    )
  ).filter(Boolean) as string[]

  if (!validatedFields.length) {
    const code = `export default {
      links: [],
    }`

    return { module: generateModule(code), paths: [] }
  }

  const importString = validatedFields
    .map((file, index) => {
      return `import CustomFieldLinkExt${index} from "${convertToImportPath(
        file
      )}"`
    })
    .join("\n")

  const exportString = `export default {
    links: [${validatedFields
      .map((_, index) => `CustomFieldLinkExt${index}.link`)
      .join(", ")}],
  }`

  const code = `${importString}\n${exportString}`

  return { module: generateModule(code), paths: validatedFields }
}

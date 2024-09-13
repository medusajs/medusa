import {
  isValidCustomFieldFormFieldPath,
  isValidCustomFieldFormTab,
  isValidCustomFieldFormZone,
} from "@medusajs/admin-shared"
import * as fs from "fs/promises"
import {
  ExportDefaultDeclaration,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  NodePath,
  ObjectProperty,
  parse,
  traverse,
} from "../babel"
import { CustomFieldConfigPath, CustomFieldFieldPath } from "../types"
import {
  convertToImportPath,
  crawl,
  generateModule,
  getParserOptions,
} from "../utils"
import { getFormArray, getModel } from "./helpers"

function validateCustomFieldFormFieldConfig(
  path: NodePath<ExportDefaultDeclaration>,
  configPath?: CustomFieldFieldPath
) {
  let hasOneValidForm = false
  const paths: Set<string> = new Set()
  const validIndexes: Set<number> = new Set()

  const { model, valid: isModelValid } = getModel(path, configPath?.model)

  if (!isModelValid) {
    return { valid: hasOneValidForm, paths: null, validIndexes: [] }
  }

  const properties = getFormArray(path)

  if (!properties || properties.elements.length === 0) {
    return { valid: hasOneValidForm, paths: null, validIndexes: [] }
  }

  properties.elements.forEach((element, index) => {
    if (!isObjectExpression(element)) {
      return
    }

    const zoneProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "zone" })
    ) as ObjectProperty | undefined

    const tabProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "tab" })
    ) as ObjectProperty | undefined

    const fieldsProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "fields" })
    ) as ObjectProperty | undefined

    if (!zoneProperty || !fieldsProperty) {
      return
    }

    if (!isStringLiteral(zoneProperty.value)) {
      return
    }

    const zone = zoneProperty.value.value

    if (
      !isValidCustomFieldFormZone(zone) ||
      (configPath && zone !== configPath.zone)
    ) {
      return
    }

    let tab: string | undefined

    if (configPath?.tab) {
      if (
        !tabProperty ||
        !isStringLiteral(tabProperty.value) ||
        tabProperty.value.value !== configPath.tab ||
        !isValidCustomFieldFormTab(tabProperty.value.value)
      ) {
        return
      }
      tab = tabProperty.value.value
    } else if (configPath && !configPath.tab) {
      if (tabProperty) {
        return
      }
    } else {
      if (tabProperty) {
        if (
          !isStringLiteral(tabProperty.value) ||
          !isValidCustomFieldFormTab(tabProperty.value.value)
        ) {
          return
        }
        tab = tabProperty.value.value
      }
    }

    const fullPath = `${model}.${zone}${tab ? `.${tab}` : ""}.$field`

    if (!isValidCustomFieldFormFieldPath(fullPath)) {
      return
    }

    hasOneValidForm = true
    paths.add(fullPath)
    validIndexes.add(index)
  })

  const _paths = paths.size > 0 ? Array.from(paths) : null
  const validIndexesArray = Array.from(validIndexes)
  return {
    valid: hasOneValidForm,
    paths: _paths,
    validIndexes: validIndexesArray.length > 0 ? validIndexesArray : null,
  }
}

export async function validateCustomFieldFormField(
  file: string,
  configPath?: CustomFieldConfigPath
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
        const { valid, paths, validIndexes } =
          validateCustomFieldFormFieldConfig(path, configPath)

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

export async function generateCustomFieldFormFieldEntrypoint(
  sources: Set<string>,
  configPath: CustomFieldConfigPath
) {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/custom-fields`)
      )
    )
  ).flat()

  const validatedForms = (
    await Promise.all(
      files.map(async (file) => {
        const { valid, indexes } = await validateCustomFieldFormField(
          file,
          configPath
        )
        return valid ? { src: file, indexes } : null
      })
    )
  ).filter(Boolean) as { src: string; indexes: number[] }[]

  if (!validatedForms.length) {
    const code = `export default {
            sections: [],
        }`

    return { module: generateModule(code), paths: [] }
  }

  const importString = validatedForms
    .map(({ src }, index) => {
      return `import CustomFieldFormFieldExt${index} from "${convertToImportPath(
        src
      )}"`
    })
    .join("\n")

  const exportString = `export default {
  sections: [${validatedForms
    .map(({ indexes }, formIndex) => {
      return `...((CustomFieldFormFieldExt${formIndex}.forms || [])
        .filter((_, i) => ${JSON.stringify(indexes)}.includes(i))
        .map(form => 
          Object.fromEntries(
            Object.entries(form.fields || {}).map(([fieldName, fieldConfig]) => [
              fieldName,
              {
                type: fieldConfig.validation,
                label: fieldConfig.label,
                description: fieldConfig.description,
                component: fieldConfig.component,
              }
            ])
          )
        )
      )`
    })
    .join(", ")}
  ],
}`

  const code = `${importString}\n${exportString}`

  return {
    module: generateModule(code),
    paths: validatedForms.map(({ src }) => src),
  }
}

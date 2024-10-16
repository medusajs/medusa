import { ArrayExpression } from "@babel/types"
import {
  isValidCustomFieldFormConfigPath,
  isValidCustomFieldFormFieldPath,
  isValidCustomFieldFormTab,
  isValidCustomFieldFormZone,
  type CustomFieldFormTab,
  type CustomFieldFormZone,
  type CustomFieldModel,
} from "@medusajs/admin-shared"
import fs from "fs/promises"
import { outdent } from "outdent"
import {
  ExportDefaultDeclaration,
  File,
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  isTemplateLiteral,
  NodePath,
  ObjectExpression,
  ObjectProperty,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import { logger } from "../logger"
import { crawl, getParserOptions, normalizePath } from "../utils"
import { getConfigArgument, getModel, validateLink } from "./helpers"

type CustomFieldConfigField = {
  name: string
  defaultValue: string
  validation: string
}

type CustomFieldConfig = {
  zone: CustomFieldFormZone
  fields: CustomFieldConfigField[]
}

type CustomFieldFormField = {
  name: string
  label: string
  description: string
  placeholder: string
  Component: string
  validation: string
}

type CustomFieldFormSection = {
  zone: CustomFieldFormZone
  tab?: CustomFieldFormTab
  fields: CustomFieldFormField[]
}

type ParsedCustomFieldConfig = {
  import: string
  model: CustomFieldModel
  configs: CustomFieldConfig[] | null
  forms: CustomFieldFormSection[] | null
}

export async function generateCustomFieldForms(sources: Set<string>) {
  const files = await getFilesFromSources(sources)
  const results = await getCustomFieldResults(files)

  const imports = results.map((result) => result.import).flat()
  const code = generateCode(results)

  return {
    imports,
    code,
  }
}

async function getFilesFromSources(sources: Set<string>): Promise<string[]> {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/custom-fields`)
      )
    )
  ).flat()
  return files
}

function generateCode(results: ParsedCustomFieldConfig[]): string {
  const groupedByModel = new Map<CustomFieldModel, ParsedCustomFieldConfig[]>()

  results.forEach((result) => {
    const model = result.model
    if (!groupedByModel.has(model)) {
      groupedByModel.set(model, [])
    }
    groupedByModel.get(model)!.push(result)
  })

  const segments: string[] = []

  groupedByModel.forEach((results, model) => {
    const configs = results
      .map((result) => formatConfig(result.configs))
      .filter((config) => config !== "")
      .join(",\n")
    const forms = results
      .map((result) => formatForms(result.forms))
      .filter((form) => form !== "")
      .join(",\n")

    segments.push(outdent`
      ${model}: {
        configs: [
          ${configs}
        ],
        forms: [
          ${forms}
        ],
      }
    `)
  })

  return outdent`
    customFields: {
      ${segments.join("\n")}
    }
  `
}

function formatConfig(configs: CustomFieldConfig[] | null): string {
  if (!configs || configs.length === 0) {
    return ""
  }

  return outdent`
    ${configs
      .map(
        (config) => outdent`
        {
          zone: "${config.zone}",
          fields: {
            ${config.fields
              .map(
                (field) => `${field.name}: {
              defaultValue: ${field.defaultValue},
              validation: ${field.validation},
            }`
              )
              .join(",\n")}
          },
        }
      `
      )
      .join(",\n")}
  `
}

function formatForms(forms: CustomFieldFormSection[] | null): string {
  if (!forms || forms.length === 0) {
    return ""
  }

  return forms
    .map(
      (form) => outdent`
        {
          zone: "${form.zone}",
          tab: ${form.tab === undefined ? undefined : `"${form.tab}"`},
          fields: {
            ${form.fields
              .map(
                (field) => `${field.name}: {
              validation: ${field.validation},
              Component: ${field.Component},
              label: ${field.label},
              description: ${field.description},
              placeholder: ${field.placeholder},
            }`
              )
              .join(",\n")}
          },
        }
      `
    )
    .join(",\n")
}

async function getCustomFieldResults(
  files: string[]
): Promise<ParsedCustomFieldConfig[]> {
  return (
    await Promise.all(files.map(async (file, index) => parseFile(file, index)))
  ).filter(Boolean) as ParsedCustomFieldConfig[]
}

async function parseFile(
  file: string,
  index: number
): Promise<ParsedCustomFieldConfig | null> {
  const content = await fs.readFile(file, "utf8")
  let ast: ParseResult<File>

  try {
    ast = parse(content, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file`, { file, error: e })
    return null
  }

  const import_ = generateImport(file, index)

  let configs: CustomFieldConfig[] | null = []
  let forms: CustomFieldFormSection[] | null = []
  let model: CustomFieldModel | null = null
  let hasLink = false
  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const _model = getModel(path, file)

        if (!_model) {
          return
        }

        model = _model
        hasLink = validateLink(path, file) // Add this line to validate link
        configs = getConfigs(path, model, index, file)
        forms = getForms(path, model, index, file)
      },
    })
  } catch (err) {
    logger.error(`An error occurred while traversing the file.`, {
      file,
      error: err,
    })
    return null
  }

  if (!model) {
    logger.warn(`'model' property is missing.`, { file })
    return null
  }

  if (!hasLink) {
    logger.warn(`'link' property is missing.`, { file })
    return null
  }

  return {
    import: import_,
    model,
    configs,
    forms,
  }
}

function generateCustomFieldConfigName(index: number): string {
  return `CustomFieldConfig${index}`
}

function generateImport(file: string, index: number): string {
  const path = normalizePath(file)
  return `import ${generateCustomFieldConfigName(index)} from "${path}"`
}

function getForms(
  path: NodePath<ExportDefaultDeclaration>,
  model: CustomFieldModel,
  index: number,
  file: string
): CustomFieldFormSection[] | null {
  const formArray = getFormsArgument(path, file)

  if (!formArray) {
    return null
  }

  const forms: CustomFieldFormSection[] = []

  formArray.elements.forEach((element, j) => {
    if (!isObjectExpression(element)) {
      return
    }

    const zoneProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "zone" })
    ) as ObjectProperty | undefined

    if (!zoneProperty) {
      logger.warn(
        `'zone' property is missing from the ${j} index of the 'forms' property. The 'zone' property is required to load a custom field form.`,
        { file }
      )
      return
    }

    if (!isStringLiteral(zoneProperty.value)) {
      logger.warn(
        `'zone' property at the ${j} index of the 'forms' property is not a string literal. The 'zone' property must be a string literal, e.g. 'general' or 'attributes'.`,
        { file }
      )
      return
    }

    const tabProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "tab" })
    ) as ObjectProperty | undefined

    let tab: string | undefined

    if (tabProperty) {
      if (!isStringLiteral(tabProperty.value)) {
        logger.warn(
          `'tab' property at the ${j} index of the 'forms' property is not a string literal. The 'tab' property must be a string literal, e.g. 'general' or 'attributes'.`,
          { file }
        )
        return
      }

      tab = tabProperty.value.value
    }

    if (tab && !isValidCustomFieldFormTab(tab)) {
      logger.warn(
        `'tab' property at the ${j} index of the 'forms' property is not a valid custom field form tab for the '${model}' model. Received: ${tab}.`,
        { file }
      )
      return
    }

    const zone = zoneProperty.value.value
    const fullPath = getFormEntryFieldPath(model, zone, tab)

    if (
      !isValidCustomFieldFormZone(zone) ||
      !isValidCustomFieldFormFieldPath(fullPath)
    ) {
      logger.warn(
        `'zone' and 'tab' properties at the ${j} index of the 'forms' property are not a valid for the '${model}' model. Received: { zone: ${zone}, tab: ${tab} }.`,
        { file }
      )
      return
    }

    const fieldsObject = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "fields" })
    ) as ObjectProperty | undefined

    if (!fieldsObject) {
      logger.warn(
        `The 'fields' property is missing at the ${j} index of the 'forms' property. The 'fields' property is required to load a custom field form.`,
        { file }
      )
      return
    }

    const fields: CustomFieldFormField[] = []

    if (!isObjectExpression(fieldsObject.value)) {
      logger.warn(
        `The 'fields' property at the ${j} index of the 'forms' property is malformed. The 'fields' property must be an object.`,
        { file }
      )
      return
    }

    fieldsObject.value.properties.forEach((field) => {
      if (!isObjectProperty(field) || !isIdentifier(field.key)) {
        return
      }

      const name = field.key.name

      if (
        !isObjectExpression(field.value) &&
        !(
          isCallExpression(field.value) &&
          isMemberExpression(field.value.callee) &&
          isIdentifier(field.value.callee.object) &&
          isIdentifier(field.value.callee.property) &&
          field.value.callee.object.name === "form" &&
          field.value.callee.property.name === "define" &&
          field.value.arguments.length === 1 &&
          isObjectExpression(field.value.arguments[0])
        )
      ) {
        logger.warn(
          `'${name}' property in the 'fields' property at the ${j} index of the 'forms' property in ${file} is malformed. The property must be an object or a call to form.define().`,
          { file }
        )
        return
      }

      const fieldObject = isObjectExpression(field.value)
        ? field.value
        : (field.value.arguments[0] as ObjectExpression)

      const labelProperty = fieldObject.properties.find(
        (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "label" })
      ) as ObjectProperty | undefined

      const descriptionProperty = fieldObject.properties.find(
        (p) =>
          isObjectProperty(p) && isIdentifier(p.key, { name: "description" })
      ) as ObjectProperty | undefined

      const componentProperty = fieldObject.properties.find(
        (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "component" })
      ) as ObjectProperty | undefined

      const validationProperty = fieldObject.properties.find(
        (p) =>
          isObjectProperty(p) && isIdentifier(p.key, { name: "validation" })
      ) as ObjectProperty | undefined

      const placeholderProperty = fieldObject.properties.find(
        (p) =>
          isObjectProperty(p) && isIdentifier(p.key, { name: "placeholder" })
      ) as ObjectProperty | undefined

      const label = getFormFieldSectionValue(
        !!labelProperty,
        index,
        j,
        name,
        "label"
      )
      const description = getFormFieldSectionValue(
        !!descriptionProperty,
        index,
        j,
        name,
        "description"
      )
      const placeholder = getFormFieldSectionValue(
        !!placeholderProperty,
        index,
        j,
        name,
        "placeholder"
      )
      const component = getFormFieldSectionValue(
        !!componentProperty,
        index,
        j,
        name,
        "component"
      )
      const validation = getFormFieldSectionValue(
        !!validationProperty,
        index,
        j,
        name,
        "validation"
      )

      fields.push({
        name,
        label,
        description,
        Component: component,
        validation,
        placeholder,
      })
    })

    forms.push({
      zone,
      tab: tab as CustomFieldFormTab | undefined,
      fields,
    })
  })

  return forms.length > 0 ? forms : null
}

function getFormFieldSectionValue(
  exists: boolean,
  fileIndex: number,
  formIndex: number,
  fieldKey: string,
  value: string
): string {
  if (!exists) {
    return "undefined"
  }

  const import_ = generateCustomFieldConfigName(fileIndex)
  return `${import_}.forms[${formIndex}].fields.${fieldKey}.${value}`
}

function getFormEntryFieldPath(
  model: CustomFieldModel,
  zone: string,
  tab?: string
): string {
  return `${model}.${zone}.${tab ? `${tab}.` : ""}$field`
}

function getConfigs(
  path: NodePath<ExportDefaultDeclaration>,
  model: CustomFieldModel,
  index: number,
  file: string
): CustomFieldConfig[] | null {
  const formArray = getFormsArgument(path, file)

  if (!formArray) {
    logger.warn(`'forms' property is missing.`, { file })
    return null
  }

  const configs: CustomFieldConfig[] = []

  formArray.elements.forEach((element, j) => {
    if (!isObjectExpression(element)) {
      logger.warn(
        `'forms' property at the ${j} index is malformed. The 'forms' property must be an object.`,
        { file }
      )
      return
    }

    const zoneProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "zone" })
    ) as ObjectProperty | undefined

    if (!zoneProperty) {
      logger.warn(
        `'zone' property is missing from the ${j} index of the 'forms' property.`,
        { file }
      )
      return
    }

    if (isTemplateLiteral(zoneProperty.value)) {
      logger.warn(
        `'zone' property at the ${j} index of the 'forms' property cannot be a template literal (e.g. \`general\`).`,
        { file }
      )
      return
    }

    if (!isStringLiteral(zoneProperty.value)) {
      logger.warn(
        `'zone' property at the ${j} index of the 'forms' property is not a string literal (e.g. 'general' or 'attributes').`,
        { file }
      )
      return
    }

    const zone = zoneProperty.value.value
    const fullPath = getFormEntryConfigPath(model, zone)

    if (
      !isValidCustomFieldFormZone(zone) ||
      !isValidCustomFieldFormConfigPath(fullPath)
    ) {
      logger.warn(
        `'zone' property at the ${j} index of the 'forms' property is not a valid custom field form zone for the '${model}' model. Received: ${zone}.`
      )
      return
    }

    const fieldsObject = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "fields" })
    ) as ObjectProperty | undefined

    if (!fieldsObject) {
      logger.warn(
        `'fields' property is missing from the ${j} entry in the 'forms' property in ${file}.`,
        { file }
      )
      return
    }

    const fields: CustomFieldConfigField[] = []

    if (!isObjectExpression(fieldsObject.value)) {
      logger.warn(
        `'fields' property at the ${j} index of the 'forms' property is malformed. The 'fields' property must be an object.`,
        { file }
      )
      return
    }

    fieldsObject.value.properties.forEach((field) => {
      if (!isObjectProperty(field) || !isIdentifier(field.key)) {
        return
      }

      const name = field.key.name

      if (
        !isObjectExpression(field.value) &&
        !(
          isCallExpression(field.value) &&
          isMemberExpression(field.value.callee) &&
          isIdentifier(field.value.callee.object) &&
          isIdentifier(field.value.callee.property) &&
          field.value.callee.object.name === "form" &&
          field.value.callee.property.name === "define" &&
          field.value.arguments.length === 1 &&
          isObjectExpression(field.value.arguments[0])
        )
      ) {
        logger.warn(
          `'${name}' property in the 'fields' property at the ${j} index of the 'forms' property in ${file} is malformed. The property must be an object or a call to form.define().`,
          { file }
        )
        return
      }

      const fieldObject = isObjectExpression(field.value)
        ? field.value
        : (field.value.arguments[0] as ObjectExpression)

      const defaultValueProperty = fieldObject.properties.find(
        (p) =>
          isObjectProperty(p) && isIdentifier(p.key, { name: "defaultValue" })
      ) as ObjectProperty | undefined

      if (!defaultValueProperty) {
        logger.warn(
          `'defaultValue' property is missing at the ${j} index of the 'forms' property in ${file}.`,
          { file }
        )
        return
      }

      const validationProperty = fieldObject.properties.find(
        (p) =>
          isObjectProperty(p) && isIdentifier(p.key, { name: "validation" })
      ) as ObjectProperty | undefined

      if (!validationProperty) {
        logger.warn(
          `'validation' property is missing at the ${j} index of the 'forms' property in ${file}.`,
          { file }
        )
        return
      }

      const defaultValue = getFormFieldValue(index, j, name, "defaultValue")
      const validation = getFormFieldValue(index, j, name, "validation")

      fields.push({
        name,
        defaultValue,
        validation,
      })
    })

    configs.push({
      zone: zone,
      fields,
    })
  })

  return configs.length > 0 ? configs : null
}

function getFormFieldValue(
  fileIndex: number,
  formIndex: number,
  fieldKey: string,
  value: string
): string {
  const import_ = generateCustomFieldConfigName(fileIndex)
  return `${import_}.forms[${formIndex}].fields.${fieldKey}.${value}`
}

function getFormEntryConfigPath(model: CustomFieldModel, zone: string): string {
  return `${model}.${zone}.$config`
}

function getFormsArgument(
  path: NodePath<ExportDefaultDeclaration>,
  file: string
): ArrayExpression | null {
  const configArgument = getConfigArgument(path)

  if (!configArgument) {
    return null
  }

  const formProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "forms" })
  ) as ObjectProperty | undefined

  if (!formProperty) {
    return null
  }

  if (!isArrayExpression(formProperty.value)) {
    logger.warn(
      `The 'forms' property is malformed. The 'forms' property must be an array of objects.`,
      { file }
    )
    return null
  }

  return formProperty.value
}

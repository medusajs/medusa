import { ArrayExpression } from "@babel/types"
import {
  isValidCustomFieldDisplayPath,
  isValidCustomFieldDisplayZone,
  isValidCustomFieldFormConfigPath,
  isValidCustomFieldFormFieldPath,
  isValidCustomFieldFormTab,
  isValidCustomFieldFormZone,
  isValidCustomFieldModel,
  type CustomFieldContainerZone,
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
import { crawl, getParserOptions } from "../utils"

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
  Component: string
  validation: string
}

type CustomFieldFormSection = {
  zone: CustomFieldFormZone
  tab?: CustomFieldFormTab
  fields: CustomFieldFormField[]
}

type CustomFieldDisplay = {
  zone: CustomFieldContainerZone
  Component: string
}

type ParsedCustomFieldConfig = {
  import: string
  model: CustomFieldModel
  configs: CustomFieldConfig[] | null
  forms: CustomFieldFormSection[] | null
  displays: CustomFieldDisplay[] | null
}

export async function generateCustomFields(sources: Set<string>) {
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
    const displays = results
      .map((result) => formatDisplays(result.displays))
      .filter((display) => display !== "")
      .join(",\n")

    segments.push(outdent`
      ${model}: {
        configs: [
          ${configs}
        ],
        forms: [
          ${forms}
        ],
        displays: [
          ${displays}
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

function formatDisplays(displays: CustomFieldDisplay[] | null): string {
  if (!displays || displays.length === 0) {
    return ""
  }

  return outdent`
    ${displays
      .map(
        (display) => outdent`
        {
          zone: "${display.zone}",
          Component: ${display.Component},
        }
      `
      )
      .join(",\n")}
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
  let displays: CustomFieldDisplay[] | null = []
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
        displays = getDisplays(path, model, index, file)
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
    displays,
  }
}

function validateLink(
  path: NodePath<ExportDefaultDeclaration>,
  file: string
): boolean {
  const configArgument = getConfigArgument(path)

  if (!configArgument) {
    return false
  }

  const linkProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "link" })
  ) as ObjectProperty | undefined

  if (!linkProperty) {
    logger.warn(`'link' property is missing.`, { file })
    return false
  }

  return true
}

function generateCustomFieldConfigName(index: number): string {
  return `CustomFieldConfig${index}`
}

function generateImport(file: string, index: number): string {
  return `import ${generateCustomFieldConfigName(index)} from "${file}"`
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

      if (!isObjectExpression(field.value)) {
        logger.warn(
          `'${name}' property in the 'fields' property at the ${j} index of the 'forms' property in ${file} is malformed. The property must be an object.`,
          { file }
        )
        return
      }

      const labelProperty = field.value.properties.find(
        (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "label" })
      ) as ObjectProperty | undefined

      const descriptionProperty = field.value.properties.find(
        (p) =>
          isObjectProperty(p) && isIdentifier(p.key, { name: "description" })
      ) as ObjectProperty | undefined

      const componentProperty = field.value.properties.find(
        (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "component" })
      ) as ObjectProperty | undefined

      const validationProperty = field.value.properties.find(
        (p) =>
          isObjectProperty(p) && isIdentifier(p.key, { name: "validation" })
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

      if (!isObjectExpression(field.value)) {
        logger.warn(
          `'${name}' property in the 'fields' property at the ${j} index of the 'forms' property is malformed. The property must be an object.`,
          { file }
        )
        return
      }

      const defaultValueProperty = field.value.properties.find(
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

      const validationProperty = field.value.properties.find(
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

function getDisplays(
  path: NodePath<ExportDefaultDeclaration>,
  model: CustomFieldModel,
  index: number,
  file: string
): CustomFieldDisplay[] | null {
  const configArgument = getConfigArgument(path)

  if (!configArgument) {
    return null
  }

  const displayProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "display" })
  ) as ObjectProperty | undefined

  if (!displayProperty) {
    return null
  }

  if (!isArrayExpression(displayProperty.value)) {
    logger.warn(
      `'display' is not an array. The 'display' property must be an array of objects.`,
      { file }
    )
    return null
  }

  const displays: CustomFieldDisplay[] = []

  displayProperty.value.elements.forEach((element, j) => {
    if (!isObjectExpression(element)) {
      return
    }

    const zoneProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "zone" })
    ) as ObjectProperty | undefined

    if (!zoneProperty) {
      logger.warn(
        `'zone' property is missing at the ${j} index of the 'display' property.`,
        { file }
      )
      return
    }

    if (!isStringLiteral(zoneProperty.value)) {
      logger.warn(
        `'zone' property at index ${j} in the 'display' property is not a string literal. 'zone' must be a string literal, e.g. 'general' or 'attributes'.`,
        { file }
      )
      return
    }

    const zone = zoneProperty.value.value
    const fullPath = getDisplayEntryPath(model, zone)

    if (
      !isValidCustomFieldDisplayZone(zone) ||
      !isValidCustomFieldDisplayPath(fullPath)
    ) {
      logger.warn(
        `'zone' is invalid at index ${j} in the 'display' property. Received: ${zone}.`,
        { file }
      )
      return
    }

    const componentProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "component" })
    ) as ObjectProperty | undefined

    if (!componentProperty) {
      logger.warn(
        `'component' property is missing at index ${j} in the 'display' property.`,
        { file }
      )
      return
    }

    displays.push({
      zone: zone,
      Component: getDisplayComponent(index, j),
    })
  })

  return displays.length > 0 ? displays : null
}

function getDisplayEntryPath(model: CustomFieldModel, zone: string): string {
  return `${model}.${zone}.$display`
}

function getDisplayComponent(
  fileIndex: number,
  displayEntryIndex: number
): string {
  const import_ = generateCustomFieldConfigName(fileIndex)
  return `${import_}.display[${displayEntryIndex}].component`
}

function getModel(
  path: NodePath<ExportDefaultDeclaration>,
  file: string
): CustomFieldModel | null {
  const configArgument = getConfigArgument(path)

  if (!configArgument) {
    return null
  }

  const modelProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "model" })
  ) as ObjectProperty | undefined

  if (!modelProperty) {
    return null
  }

  if (isTemplateLiteral(modelProperty.value)) {
    logger.warn(
      `'model' property cannot be a template literal (e.g. \`product\`).`,
      { file }
    )
    return null
  }

  if (!isStringLiteral(modelProperty.value)) {
    logger.warn(
      `'model' is invalid. The 'model' property must be a string literal, e.g. 'product' or 'customer'.`,
      { file }
    )
    return null
  }

  const model = modelProperty.value.value.trim()

  if (!isValidCustomFieldModel(model)) {
    logger.warn(
      `'model' is invalid, received: ${model}. The 'model' property must be set to a valid model, e.g. 'product' or 'customer'.`,
      { file }
    )
    return null
  }

  return model
}

function getConfigArgument(
  path: NodePath<ExportDefaultDeclaration>
): ObjectExpression | null {
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

  return configArgument
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

import { FormId } from "@medusajs/admin-shared"
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

function getFormProperties(path: NodePath<ExportDefaultDeclaration>) {
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

  const formProperty = configArgument.properties.find((p) => {
    return isObjectProperty(p) && isIdentifier(p.key, { name: "forms" })
  }) as ObjectProperty | undefined

  if (!formProperty || !isArrayExpression(formProperty.value)) {
    return null
  }

  return formProperty.value
}

function validateCustomFieldFormConfig(
  path: NodePath<ExportDefaultDeclaration>,
  form?: FormId
) {
  let formIsValid = false
  const formValues: Set<string> = new Set()
  const validIndexes: Set<number> = new Set()

  const isEntrypointMatch = validateEntrypoint(path, form)

  if (!isEntrypointMatch) {
    return { formIsValid, formValue: null, validIndexes: [] }
  }

  const properties = getFormProperties(path)

  if (!properties || properties.elements.length === 0) {
    return { formIsValid, formValue: null, validIndexes: [] }
  }

  properties.elements.forEach((element, index) => {
    if (!isObjectExpression(element)) {
      return
    }

    const formProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "form" })
    ) as ObjectProperty | undefined

    const schemaProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "schema" })
    ) as ObjectProperty | undefined

    const componentProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "component" })
    ) as ObjectProperty | undefined

    if (!formProperty || !schemaProperty || !componentProperty) {
      return
    }

    let isValidForm = false
    if (isStringLiteral(formProperty.value)) {
      if (!form || formProperty.value.value === form) {
        isValidForm = true
        formValues.add(formProperty.value.value)
      }
    } else if (isArrayExpression(formProperty.value)) {
      formProperty.value.elements.forEach((e) => {
        if (isStringLiteral(e)) {
          if (!form || e.value === form) {
            formValues.add(e.value)
            isValidForm = true
          }
        }
      })
    }

    // We can't fully validate if it's a ZodSchema, but we can check if it's a call expression
    const isValidSchema = isCallExpression(schemaProperty.value)

    // We can't validate if it's a React component, but we can check if it's present
    const hasComponent = !!componentProperty

    if (isValidForm && isValidSchema && hasComponent) {
      formIsValid = true
      validIndexes.add(index)
    }
  })

  const formValue = formValues.size > 0 ? Array.from(formValues) : null
  const validIndexesArray = Array.from(validIndexes)
  return {
    formIsValid,
    formValue,
    validIndexes: validIndexesArray.length > 0 ? validIndexesArray : null,
  }
}

export async function validateCustomFieldForm(
  file: string,
  form?: FormId
): Promise<
  | { valid: true; form: FormId | FormId[]; indexes: number[] }
  | { valid: false; form: null; indexes: null }
> {
  let _formValue: string | string[] | null = null
  let _indexes: number[] | null = null

  const content = await fs.readFile(file, "utf-8")
  const parserOptions = getParserOptions(file)

  let ast: ParseResult<File>

  try {
    ast = parse(content, parserOptions)
  } catch (e) {
    return { valid: false, form: _formValue, indexes: _indexes }
  }

  let isValid = false

  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const { formIsValid, formValue, validIndexes } =
          validateCustomFieldFormConfig(path, form)
        isValid = formIsValid
        _formValue = formValue
        _indexes = validIndexes
      },
    })
  } catch (err) {
    return { valid: false, form: _formValue, indexes: _indexes }
  }

  return {
    valid: isValid,
    form: _formValue as any,
    indexes: _indexes,
  }
}

export async function generateCustomFieldFormEntrypoint(
  sources: Set<string>,
  form: FormId
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
        const { valid, indexes } = await validateCustomFieldForm(file, form)
        return valid ? { src: file, indexes } : null
      })
    )
  ).filter(Boolean) as { src: string; indexes: number[] }[]

  if (!validatedForms.length) {
    const code = `export default {
            blocks: [],
        }`

    return { module: generateModule(code), paths: [] }
  }

  const importString = validatedForms
    .map(({ src }, index) => {
      return `import FormExt${index} from "${convertToImportPath(src)}"`
    })
    .join("\n")

  const exportString = `export default {
            blocks: [${validatedForms
              .map(({ indexes }, index) => {
                return indexes.map(
                  (i) =>
                    `{ component: FormExt${index}.forms[${i}].component, schema: FormExt${index}.forms[${i}].schema }`
                )
              })
              .flat()
              .join(", ")}],
        }`

  const code = `${importString}\n${exportString}`

  return {
    module: generateModule(code),
    paths: validatedForms.map(({ src }) => src),
  }
}

const Ajv = require("ajv")
const fs = require("fs")
const path = require("path")

const schema = require("../../src/i18n/translations/$schema.json")
const pluralConfig = require("../../src/i18n/plural-config.json")

const ajv = new Ajv({ allErrors: true, strict: false })
const validateSchema = ajv.compile(schema)

const fileName = process.argv[2]
if (!fileName) {
  console.error("Please provide a file name (e.g., en.json) as an argument.")
  process.exit(1)
}

const langCode = fileName.replace(".json", "")
const requiredForms = pluralConfig[langCode]

if (!requiredForms) {
  console.error(`Language "${langCode}" not found in plural-config.json`)
  process.exit(1)
}

const filePath = path.join(__dirname, "../../src/i18n/translations", fileName)
const translations = JSON.parse(fs.readFileSync(filePath, "utf-8"))

function findAllPluralKeys(obj, currentPath = "") {
  const pluralKeys = []

  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return pluralKeys
  }

  Object.entries(obj).forEach(([key, value]) => {
    if (/_(?:zero|one|two|few|many|other)$/.test(key)) {
      pluralKeys.push({ path: currentPath, key })
    }

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key
      pluralKeys.push(...findAllPluralKeys(value, fullPath))
    }
  })

  return pluralKeys
}

function getNestedValue(obj, path) {
  if (!path) return obj
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

const schemaValid = validateSchema(translations)

const errors = []
const allPluralKeys = findAllPluralKeys(translations)
const pluralGroups = new Map()

allPluralKeys.forEach(({ path, key }) => {
  const baseKey = key.replace(/_(?:zero|one|two|few|many|other)$/, "")
  const groupKey = path ? `${path}.${baseKey}` : baseKey

  if (!pluralGroups.has(groupKey)) {
    pluralGroups.set(groupKey, { path, baseKey })
  }
})

pluralGroups.forEach(({ path, baseKey }, groupKey) => {
  const parent = getNestedValue(translations, path)
  const instancePath = path ? `/${path.replace(/\./g, "/")}` : ""

  requiredForms.forEach((form) => {
    const key = `${baseKey}_${form}`
    if (!parent?.[key]) {
      errors.push({
        type: "missing",
        instancePath,
        key,
      })
    }
  })

  const allForms = ["zero", "one", "two", "few", "many", "other"]

  allForms.forEach((form) => {
    const key = `${baseKey}_${form}`
    if (parent?.[key] && !requiredForms.includes(form)) {
      errors.push({
        type: "extra",
        instancePath,
        key,
        form,
      })
    }
  })
})

if (!schemaValid) {
  console.error(`\nSchema validation failed for ${fileName}:`)
  validateSchema.errors?.forEach((error) => {
    const location = error.instancePath || "root"
    if (error.keyword === "required") {
      const missingKey = error.params.missingProperty
      console.error(`  Missing required key: "${missingKey}" at ${location}`)
    } else if (error.keyword === "additionalProperties") {
      const extraKey = error.params.additionalProperty
      console.error(`  Unexpected key: "${extraKey}" at ${location}`)
    } else {
      console.error(`  Error: ${error.message} at ${location}`)
    }
  })
}

if (errors.length > 0) {
  console.error(
    `\nPlural validation failed for ${fileName} [${requiredForms.join(", ")}]:`
  )

  errors.forEach(({ type, instancePath, key }) => {
    const location = instancePath || "root"
    if (type === "missing") {
      console.error(`  Missing required plural key: "${key}" at ${location}`)
    } else {
      console.error(`  Unexpected plural key: "${key}" at ${location}`)
    }
  })
}

if (!schemaValid || errors.length > 0) {
  process.exit(1)
}

console.log(`\n✓ ${fileName} is valid and matches the schema.`)
process.exit(0)

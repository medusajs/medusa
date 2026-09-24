const fs = require("fs")
const path = require("path")

const pluralConfig = require("../../src/i18n/plural-config.json")

const translationsDir = path.join(__dirname, "../../src/i18n/translations")
const PLURAL_SUFFIX = /^(.+)_(zero|one|two|few|many|other)$/
const IGNORED_KEYS = new Set(["$schema"])

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"))
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
}

function getLocales() {
  return fs
    .readdirSync(translationsDir)
    .filter((file) => file.endsWith(".json") && file !== "$schema.json")
    .map((file) => file.replace(".json", ""))
    .filter((locale) => locale !== "en")
    .sort()
}

function getPlaceholders(value, isPlural) {
  return (value.match(/{{\s*[^}]+?\s*}}|<\/?\d+\s*\/?>/g) || [])
    .map((placeholder) => placeholder.replace(/\s/g, ""))
    .filter((placeholder) => !isPlural || placeholder !== "{{count}}")
    .sort()
}

function getExpectedEntries(enObj, forms) {
  const entries = []
  const seenPluralGroups = new Set()

  Object.entries(enObj).forEach(([key, value]) => {
    if (IGNORED_KEYS.has(key)) {
      return
    }

    const pluralMatch = key.match(PLURAL_SUFFIX)

    if (!pluralMatch || isObject(value)) {
      entries.push([key, value])
      return
    }

    const baseKey = pluralMatch[1]
    if (seenPluralGroups.has(baseKey)) {
      return
    }
    seenPluralGroups.add(baseKey)

    forms.forEach((form) => {
      entries.push([
        `${baseKey}_${form}`,
        `${baseKey}_${form}` in enObj
          ? enObj[`${baseKey}_${form}`]
          : enObj[`${baseKey}_other`],
      ])
    })
  })

  return entries
}

function findMissing(enObj, localeObj, forms) {
  const missing = {}
  let count = 0

  getExpectedEntries(enObj, forms).forEach(([key, enValue]) => {
    const localeValue = localeObj ? localeObj[key] : undefined

    if (isObject(enValue)) {
      const nested = findMissing(
        enValue,
        isObject(localeValue) ? localeValue : undefined,
        forms
      )

      if (nested.count > 0) {
        missing[key] = nested.missing
        count += nested.count
      }
      return
    }

    if (typeof localeValue !== "string" || localeValue.trim() === "") {
      missing[key] = enValue
      count++
    }
  })

  return { missing, count }
}

// New keys go after their closest preceding en.json sibling so existing key order is kept.
function mergeLevel(enObj, localeObj, translated, forms, keyPath, errors) {
  const expected = getExpectedEntries(enObj, forms)
  const result = Object.entries(isObject(localeObj) ? localeObj : {})

  Object.keys(translated).forEach((key) => {
    if (!expected.some(([expectedKey]) => expectedKey === key)) {
      errors.push(`Unknown key "${[...keyPath, key].join(".")}"`)
    }
  })

  expected.forEach(([key, enValue], index) => {
    if (!(key in translated)) {
      return
    }

    const fullKey = [...keyPath, key].join(".")
    const translatedValue = translated[key]
    const existingIndex = result.findIndex(([k]) => k === key)
    let value

    if (isObject(enValue)) {
      if (!isObject(translatedValue)) {
        errors.push(`Expected an object at "${fullKey}"`)
        return
      }

      value = mergeLevel(
        enValue,
        existingIndex === -1 ? undefined : result[existingIndex][1],
        translatedValue,
        forms,
        [...keyPath, key],
        errors
      )

      if (existingIndex === -1 && Object.keys(value).length === 0) {
        return
      }
    } else {
      if (existingIndex !== -1) {
        errors.push(`"${fullKey}" is already translated`)
        return
      }

      if (typeof translatedValue !== "string" || !translatedValue.trim()) {
        errors.push(`Expected a non-empty string at "${fullKey}"`)
        return
      }

      // Plural forms other than the English ones may legitimately add or drop {{count}}.
      const isPlural = PLURAL_SUFFIX.test(key)
      const expectedPlaceholders = getPlaceholders(enValue, isPlural).join(",")
      const actualPlaceholders = getPlaceholders(
        translatedValue,
        isPlural
      ).join(",")

      if (expectedPlaceholders !== actualPlaceholders) {
        errors.push(
          `Placeholder mismatch at "${fullKey}": expected [${expectedPlaceholders}], got [${actualPlaceholders}]`
        )
        return
      }

      value = translatedValue
    }

    if (existingIndex !== -1) {
      result[existingIndex] = [key, value]
      return
    }

    let insertAt = result.length && result[0][0] === "$schema" ? 1 : 0
    for (let i = index - 1; i >= 0; i--) {
      const previousIndex = result.findIndex(([k]) => k === expected[i][0])
      if (previousIndex !== -1) {
        insertAt = previousIndex + 1
        break
      }
    }

    result.splice(insertAt, 0, [key, value])
  })

  return Object.fromEntries(result)
}

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      args[argv[i].slice(2)] = argv[i + 1]
      i++
    }
  }
  return args
}

function runMissing({ output }) {
  const en = readJson(path.join(translationsDir, "en.json"))
  const report = {}
  let total = 0

  getLocales().forEach((locale) => {
    const forms = pluralConfig[locale]
    if (!forms) {
      throw new Error(`Language "${locale}" not found in plural-config.json`)
    }

    const localeJson = readJson(path.join(translationsDir, `${locale}.json`))
    const { missing, count } = findMissing(en, localeJson, forms)

    if (count > 0) {
      report[locale] = { count, pluralForms: forms, missing }
      total += count
    }
    console.log(`${locale}: ${count} missing`)
  })

  console.log(`Total: ${total} missing translations`)

  if (output) {
    writeJson(output, report)
    console.log(`Report written to ${output}`)
  }
}

function runApply({ input }) {
  if (!input) {
    console.error("Please provide --input <directory of <locale>.json files>")
    process.exit(1)
  }

  const en = readJson(path.join(translationsDir, "en.json"))
  const locales = new Set(getLocales())
  const files = fs.existsSync(input)
    ? fs
        .readdirSync(input)
        .filter((file) => file.endsWith(".json"))
        .sort()
    : []
  files.forEach((file) => {
    const locale = file.split(".")[0]

    if (!locales.has(locale)) {
      console.warn(`Skipping ${file}: no matching translation file`)
      return
    }

    const localePath = path.join(translationsDir, `${locale}.json`)
    const errors = []
    const merged = mergeLevel(
      en,
      readJson(localePath),
      readJson(path.join(input, file)),
      pluralConfig[locale],
      [],
      errors
    )

    if (errors.length > 0) {
      console.warn(`Skipped keys in ${file}:\n  ${errors.join("\n  ")}`)
    }

    writeJson(localePath, merged)
    console.log(`Updated ${locale}.json`)
  })
}

function main() {
  const [command, ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)

  if (command === "missing") {
    runMissing(args)
  } else if (command === "apply") {
    runApply(args)
  } else {
    console.error("Usage: sync-translations.js <missing|apply> [options]")
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { findMissing, getPlaceholders, mergeLevel }

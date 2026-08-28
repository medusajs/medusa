import fs from "fs"
import path from "path"
import { describe, expect, test } from "vitest"

import schema from "../$schema.json"
import pluralConfig from "../../plural-config.json"

const translationsDir = path.join(__dirname, "..")

function getRequiredKeysFromSchema(schema: any, prefix = ""): string[] {
  const keys: string[] = []

  if (schema.type === "object" && schema.properties) {
    Object.entries(schema.properties).forEach(([key, value]: [string, any]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (value.type === "object") {
        keys.push(...getRequiredKeysFromSchema(value, fullKey))
      } else if (schema.required?.includes(key)) {
        keys.push(fullKey)
      }
    })
  }

  return keys.sort()
}

function getAllKeysFromSchema(schema: any, prefix = ""): Set<string> {
  const keys = new Set<string>()

  if (schema.type === "object" && schema.properties) {
    Object.entries(schema.properties).forEach(([key, value]: [string, any]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      keys.add(fullKey)

      if (value.type === "object") {
        const nestedKeys = getAllKeysFromSchema(value, fullKey)
        nestedKeys.forEach((k) => keys.add(k))
      }
    })
  }

  return keys
}

function getTranslationKeys(obj: any, prefix = ""): string[] {
  const keys: string[] = []

  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...getTranslationKeys(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  })

  return keys.sort()
}

function findPluralGroups(
  obj: any,
  currentPath = ""
): Map<string, Set<string>> {
  const groups = new Map<string, Set<string>>()

  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return groups
  }

  Object.entries(obj).forEach(([key, value]) => {
    const pluralMatch = key.match(/^(.+)_(zero|one|two|few|many|other)$/)

    if (pluralMatch) {
      const [, baseKey, form] = pluralMatch
      const fullPath = currentPath ? `${currentPath}.${baseKey}` : baseKey

      if (!groups.has(fullPath)) {
        groups.set(fullPath, new Set())
      }
      groups.get(fullPath)!.add(form)
    }

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key
      const nestedGroups = findPluralGroups(value, fullPath)
      nestedGroups.forEach((forms, path) => groups.set(path, forms))
    }
  })

  return groups
}

describe("translation schema validation", () => {
  test("en.json should have all required keys defined in schema", () => {
    const enPath = path.join(translationsDir, "en.json")
    const enTranslations = JSON.parse(fs.readFileSync(enPath, "utf-8"))

    const schemaKeys = getRequiredKeysFromSchema(schema)
    const translationKeys = getTranslationKeys(enTranslations)

    const missing = schemaKeys.filter((key) => !translationKeys.includes(key))

    if (missing.length > 0) {
      console.error("\nMissing required keys in en.json:", missing)
    }

    expect(missing).toEqual([])
  })

  test("en.json should not have extra keys", () => {
    const enPath = path.join(translationsDir, "en.json")
    const enTranslations = JSON.parse(fs.readFileSync(enPath, "utf-8"))

    const allSchemaKeys = getAllKeysFromSchema(schema)
    const translationKeys = getTranslationKeys(enTranslations)
    const extra = translationKeys.filter((key) => !allSchemaKeys.has(key))

    if (extra.length > 0) {
      console.error("\nExtra keys in en.json:", extra)
    }

    expect(extra).toEqual([])
  })

  test("en.json plural keys should match required forms", () => {
    const enPath = path.join(translationsDir, "en.json")
    const enTranslations = JSON.parse(fs.readFileSync(enPath, "utf-8"))

    const requiredForms = pluralConfig.en
    const pluralGroups = findPluralGroups(enTranslations)
    const errors: string[] = []

    pluralGroups.forEach((forms, baseKey) => {
      forms.forEach((form) => {
        if (!requiredForms.includes(form)) {
          errors.push(`${baseKey}_${form} - English doesn't use "${form}" form`)
        }
      })
      requiredForms.forEach((form) => {
        if (!forms.has(form)) {
          errors.push(`${baseKey}_${form} - Missing required form for English`)
        }
      })
    })

    if (errors.length > 0) {
      console.error("\nPlural form errors in en.json:", errors)
    }

    expect(errors).toEqual([])
  })
})

/**
 * Per-locale plural-form coverage. i18next resolves a plural key by appending
 * the CLDR plural category for the count (e.g. `count_few` for Czech 2-4).
 * When a translation file is missing a category its plural-config.json
 * declares, i18next falls back to English inside an otherwise-translated
 * screen. Every translation file must supply every plural category its
 * locale requires.
 *
 * The test is initially informational across the board: every locale's
 * plural-form coverage is logged via console.warn but does not fail the
 * build. The intent is to surface the gap so contributors can see which
 * locales need work. A locale can be promoted to strict mode (the test
 * fails on a missing form) by adding it to READY_LOCALES. Promoting a
 * locale should be done in the same PR that brings the locale up to
 * spec, so the test enforces what the PR claims to fix.
 */
const READY_LOCALES: Set<string> = new Set(["pl"])

describe("translation plural-form coverage per locale", () => {
  Object.entries(pluralConfig).forEach(([locale, requiredForms]) => {
    if (locale === "en") {
      return
    }

    // I/O is performed inside the test() callback (not at describe time) so
    // that a missing or unreadable translation file fails only that locale's
    // test, not the entire describe block.
    test(`${locale}.json plural keys should match required forms`, () => {
      const localePath = path.join(translationsDir, `${locale}.json`)
      const translations = JSON.parse(fs.readFileSync(localePath, "utf-8"))
      const pluralGroups = findPluralGroups(translations)

      const errors: string[] = []

      pluralGroups.forEach((forms, baseKey) => {
        requiredForms.forEach((form) => {
          if (!forms.has(form)) {
            errors.push(
              `${baseKey}_${form} - missing required form for ${locale}`
            )
          }
        })
        forms.forEach((form) => {
          if (!requiredForms.includes(form)) {
            errors.push(
              `${baseKey}_${form} - ${locale} doesn't use "${form}" form`
            )
          }
        })
      })

      if (READY_LOCALES.has(locale)) {
        if (errors.length > 0) {
          console.error(`\nPlural form errors in ${locale}.json:`, errors)
        }
        expect(errors).toEqual([])
      } else if (errors.length > 0) {
        // Report-only mode: surface the missing forms so the next contributor
        // can pick a locale and fix it, but do not block CI.
        console.warn(
          `\n[${locale}] ${errors.length} plural form(s) incomplete (reported, not enforced):`
        )
        errors.forEach((e) => console.warn(`  - ${e}`))
      }
    })
  })
})

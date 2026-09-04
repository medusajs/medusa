import { i18n } from "i18next"

/**
 * Normalizes internal locale codes (e.g. "enGB", "ptBR") to BCP-47
 * tags that Intl APIs accept (e.g. "en-GB", "pt-BR").
 * Falls back to the original string if normalization fails.
 */
function normalizeBcp47(code: string): string {
  // Already BCP-47 compliant (e.g. "en-US", "zh-TW")
  if (code.includes("-")) {
    return code
  }

  // Language-only codes (e.g. "en", "fr", "ja")
  if (code.length === 2) {
    return code
  }

  // Codes like "enGB", "ptBR", "zhCN" → "en-GB", "pt-BR", "zh-CN"
  if (code.length === 4 && code[2] === code[2].toUpperCase()) {
    return `${code.slice(0, 2)}-${code.slice(2)}`
  }

  return code
}

/**
 * Returns a DisplayNames instance for the given type (region/currency)
 * using the current i18n language. Falls back to English.
 */
function getDisplayNames(type: "region" | "currency", language?: string) {
  const code = normalizeBcp47(language || i18n.languages?.[0] || "en")

  try {
    return new Intl.DisplayNames([code], { type })
  } catch {
    return new Intl.DisplayNames(["en"], { type })
  }
}

/**
 * Returns the translated name of a country given its ISO 2-letter code,
 * localized to the current admin language. Falls back to the static
 * `display_name` from the countries data file.
 */
export function getTranslatedCountryName(
  iso2: string,
  fallback: string
): string {
  try {
    const displayNames = getDisplayNames("region", i18n.languages?.[0])
    return displayNames.of(iso2.toUpperCase()) || fallback
  } catch {
    return fallback
  }
}

/**
 * Returns the translated name of a currency given its ISO 4217 code,
 * localized to the current admin language. Falls back to the static
 * `name` from the currencies data file.
 */
export function getTranslatedCurrencyName(
  code: string,
  fallback: string
): string {
  try {
    const displayNames = getDisplayNames("currency", i18n.languages?.[0])
    return displayNames.of(code.toUpperCase()) || fallback
  } catch {
    return fallback
  }
}

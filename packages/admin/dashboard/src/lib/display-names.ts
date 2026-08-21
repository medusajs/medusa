import i18n from "i18next"

type DisplayNameType = "currency" | "region"

const displayNamesCache = new Map<string, Intl.DisplayNames | null>()

/**
 * `Intl.DisplayNames` is not free to construct, so instances are reused. The key covers the type as
 * well as the locale, since one locale needs a separate instance per type.
 */
function getDisplayNames(
  locale: string,
  type: DisplayNameType
): Intl.DisplayNames | null {
  const key = `${locale}|${type}`

  if (!displayNamesCache.has(key)) {
    try {
      // `fallback: "code"` makes `of` hand the code back when there is no entry, which is what
      // `resolve` below checks for.
      displayNamesCache.set(
        key,
        new Intl.DisplayNames([locale], { fallback: "code", type })
      )
    } catch {
      // An unsupported locale should fall back to the packaged English name rather than break the
      // screen that is rendering it.
      displayNamesCache.set(key, null)
    }
  }

  return displayNamesCache.get(key) ?? null
}

function resolve(
  code: string | null | undefined,
  type: DisplayNameType,
  fallback: string | undefined,
  locale: string
): string | undefined {
  if (!code) {
    return fallback
  }

  const upperCased = code.toUpperCase()

  try {
    // `of` returns the code back when CLDR has no entry for it, which is not a translation.
    const resolved = getDisplayNames(locale, type)?.of(upperCased)

    if (resolved && resolved !== upperCased) {
      return resolved
    }
  } catch {
    // RangeError for a structurally invalid code.
  }

  return fallback
}

/**
 * Translate an ISO 3166-1 alpha-2 country code into the current admin language, falling back to the
 * packaged English name when the platform has no entry for it.
 */
export function getCountryDisplayName(
  iso2: string | null | undefined,
  fallback: string,
  locale?: string
): string
export function getCountryDisplayName(
  iso2: string | null | undefined,
  fallback?: string,
  locale?: string
): string | undefined
export function getCountryDisplayName(
  iso2: string | null | undefined,
  fallback?: string,
  locale: string = i18n.language
): string | undefined {
  return resolve(iso2, "region", fallback, locale)
}

/**
 * Translate an ISO 4217 currency code into the current admin language, falling back to the packaged
 * English name. Codes outside ISO 4217, such as `IRT`, resolve in no locale and always fall back.
 */
export function getCurrencyDisplayName(
  code: string | null | undefined,
  fallback: string,
  locale?: string
): string
export function getCurrencyDisplayName(
  code: string | null | undefined,
  fallback?: string,
  locale?: string
): string | undefined
export function getCurrencyDisplayName(
  code: string | null | undefined,
  fallback?: string,
  locale: string = i18n.language
): string | undefined {
  return resolve(code, "currency", fallback, locale)
}

/**
 * Localized display names for countries and currencies, using the platform's
 * built-in `Intl.DisplayNames` so we do not have to ship 250 country names
 * x 33 locales. The hard-coded English arrays in `lib/data/countries.ts` and
 * the `currency.name` field shipped by the backend stay as the fallback
 * wherever CLDR has no data for a code (e.g. `IRT`, defunct currencies).
 *
 * The helper is intentionally a pure function (no React, no i18next) so it
 * can be called from list-mappers and table cells where hooks cannot run.
 * Pass the current BCP-47 locale tag (e.g. `en-GB`, `pt-BR`) - the i18n
 * provider exposes `formatLocaleCode` to derive it from the i18n language
 * code stored in `i18n/languages.ts`.
 */

const COUNTRY_TAG_OVERRIDES: Record<string, string> = {
  // `new Intl.DisplayNames(["en-GB"], { type: "region" }).of("GB")` returns
  // "UK" in some Node versions and "United Kingdom" in others. Pin the
  // long form for the two locales where this has been observed.
}

const CURRENCY_TAG_OVERRIDES: Record<string, string> = {
  // No currency overrides yet - the CLDR data is consistent across Node
  // versions for every currency we ship.
}

/**
 * Resolve the localized name for an ISO 3166-1 alpha-2 country code.
 *
 * Returns the hard-coded English `display_name` from `data/countries.ts`
 * if the code is unknown, if the locale is not recognized by
 * `Intl.DisplayNames`, or if CLDR has no entry for the code.
 */
export const getCountryDisplayName = (
  iso2: string | null | undefined,
  localeTag: string | null | undefined
): string | undefined => {
  if (!iso2 || !localeTag) {
    return undefined
  }
  try {
    const normalized = COUNTRY_TAG_OVERRIDES[localeTag] ?? localeTag
    const display = new Intl.DisplayNames([normalized], { type: "region" })
    const name = display.of(iso2.toUpperCase())
    // `Intl.DisplayNames.of` returns the input code (rather than throwing)
    // for unknown codes. Treat that as "no data" and fall back.
    if (!name || name === iso2.toUpperCase()) {
      return undefined
    }
    return name
  } catch {
    return undefined
  }
}

/**
 * Resolve the localized name for an ISO 4217 currency code.
 *
 * Same fallback semantics as `getCountryDisplayName`.
 */
export const getCurrencyDisplayName = (
  code: string | null | undefined,
  localeTag: string | null | undefined
): string | undefined => {
  if (!code || !localeTag) {
    return undefined
  }
  try {
    const normalized = CURRENCY_TAG_OVERRIDES[localeTag] ?? localeTag
    const display = new Intl.DisplayNames([normalized], { type: "currency" })
    const upper = code.toUpperCase()
    const name = display.of(upper)
    // `Intl.DisplayNames.of` for currency returns the input code (not
    // `undefined`) when CLDR has no entry. Treat that as "no data" and
    // fall back to the caller's English name.
    if (!name || name === upper) {
      return undefined
    }
    return name
  } catch {
    return undefined
  }
}

/**
 * Resolve the localized name for a `StaticCountry` (the shape returned by
 * `getCountryByIso2` in `lib/data/countries.ts`). This is the most common
 * call site - the static country already has `name` (uppercase, stored
 * canonical) and `display_name` (English, human-readable), and the helper
 * prefers the localized name when one is available, falling back to
 * `display_name` so the English behaviour is identical to today.
 */
export const getCountryDisplayNameFromStatic = (
  country: { iso_2: string; display_name: string } | null | undefined,
  localeTag: string | null | undefined
): string | undefined => {
  if (!country) {
    return undefined
  }
  return getCountryDisplayName(country.iso_2, localeTag) ?? country.display_name
}

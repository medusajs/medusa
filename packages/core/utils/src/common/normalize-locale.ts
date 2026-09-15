import { upperCaseFirst } from "./upper-case-first"

/**
 * Normalizes a locale string to {@link https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag|BCP 47 language tag format}
 * @param locale - The locale string to normalize
 * @returns The normalized locale string
 *
 * @example
 * input: "en-Us"
 * output: "en-US"
 *
 * @example
 * input: "eN"
 * output: "en"
 *
 * @example
 * input: "RU-cYrl-By"
 * output: "ru-Cyrl-BY"
 *
 * @example
 * input: "zh-hans"
 * output: "zh-Hans"
 */
export function normalizeLocale(locale: string) {
  const segments = locale.split("-")

  if (segments.length === 1) {
    return segments[0].toLowerCase()
  }

  // e.g en-US, or a script subtag such as zh-Hans
  if (segments.length === 2) {
    const isScript = /^[a-z]{4}$/i.test(segments[1])

    return `${segments[0].toLowerCase()}-${
      isScript
        ? upperCaseFirst(segments[1].toLowerCase())
        : segments[1].toUpperCase()
    }`
  }

  // e.g ru-Cyrl-BY
  if (segments.length === 3) {
    return `${segments[0].toLowerCase()}-${upperCaseFirst(
      segments[1].toLowerCase()
    )}-${segments[2].toUpperCase()}`
  }

  return locale
}

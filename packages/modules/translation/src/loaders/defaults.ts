import {
  LoaderOptions,
  Logger,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  normalizeLocale,
} from "@medusajs/framework/utils"
import Locale from "@models/locale"

/**
 * BCP 47 Language Tags
 * Common language-region codes following the IETF BCP 47 standard.
 * Format: language[-script][-region]
 * Examples: "en-US" (English, United States), "zh-Hans-CN" (Chinese Simplified, China)
 */
const defaultLocales = [
  { code: "en-US", name: "English (United States)" },
  { code: "en-GB", name: "English (United Kingdom)" },
  { code: "en-AU", name: "English (Australia)" },
  { code: "en-CA", name: "English (Canada)" },
  { code: "es-ES", name: "Spanish (Spain)" },
  { code: "es-MX", name: "Spanish (Mexico)" },
  { code: "es-AR", name: "Spanish (Argentina)" },
  { code: "fr-FR", name: "French (France)" },
  { code: "fr-CA", name: "French (Canada)" },
  { code: "fr-BE", name: "French (Belgium)" },
  { code: "de-DE", name: "German (Germany)" },
  { code: "de-AT", name: "German (Austria)" },
  { code: "de-CH", name: "German (Switzerland)" },
  { code: "it-IT", name: "Italian (Italy)" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "pt-PT", name: "Portuguese (Portugal)" },
  { code: "nl-NL", name: "Dutch (Netherlands)" },
  { code: "nl-BE", name: "Dutch (Belgium)" },
  { code: "da-DK", name: "Danish (Denmark)" },
  { code: "sv-SE", name: "Swedish (Sweden)" },
  { code: "nb-NO", name: "Norwegian Bokmål (Norway)" },
  { code: "fi-FI", name: "Finnish (Finland)" },
  { code: "pl-PL", name: "Polish (Poland)" },
  { code: "lt-LT", name: "Lithuanian (Lithuania)" },
  { code: "cs-CZ", name: "Czech (Czech Republic)" },
  { code: "sk-SK", name: "Slovak (Slovakia)" },
  { code: "hu-HU", name: "Hungarian (Hungary)" },
  { code: "ro-RO", name: "Romanian (Romania)" },
  { code: "bg-BG", name: "Bulgarian (Bulgaria)" },
  { code: "el-GR", name: "Greek (Greece)" },
  { code: "tr-TR", name: "Turkish (Turkey)" },
  { code: "ru-RU", name: "Russian (Russia)" },
  { code: "uk-UA", name: "Ukrainian (Ukraine)" },
  { code: "ar-SA", name: "Arabic (Saudi Arabia)" },
  { code: "ar-AE", name: "Arabic (United Arab Emirates)" },
  { code: "ar-EG", name: "Arabic (Egypt)" },
  { code: "he-IL", name: "Hebrew (Israel)" },
  { code: "hi-IN", name: "Hindi (India)" },
  { code: "bn-BD", name: "Bengali (Bangladesh)" },
  { code: "th-TH", name: "Thai (Thailand)" },
  { code: "vi-VN", name: "Vietnamese (Vietnam)" },
  { code: "id-ID", name: "Indonesian (Indonesia)" },
  { code: "ms-MY", name: "Malay (Malaysia)" },
  { code: "tl-PH", name: "Tagalog (Philippines)" },
  { code: "zh-CN", name: "Chinese Simplified (China)" },
  { code: "zh-TW", name: "Chinese Traditional (Taiwan)" },
  { code: "zh-HK", name: "Chinese Traditional (Hong Kong)" },
  { code: "ja-JP", name: "Japanese (Japan)" },
  { code: "ko-KR", name: "Korean (South Korea)" },
  { code: "ka-GE", name: "Georgian (Georgia)" },
  { code: "mn-MN", name: "Mongolian (Mongolia)" },
]

export default async ({ container }: LoaderOptions): Promise<void> => {
  const logger =
    container.resolve<Logger>(ContainerRegistrationKeys.LOGGER) ?? console
  const localeService_: ModulesSdkTypes.IMedusaInternalService<typeof Locale> =
    container.resolve("localeService")

  try {
    // Fetch existing locales to map their IDs for upsert
    // The upsert method uses `id` as the key, so we need to include IDs for existing locales
    const existingLocales = await localeService_.list(
      {},
      { select: ["id", "code"] }
    )
    const existingByCode = new Map(
      existingLocales.map((l) => [l.code, l.id])
    )

    // Map default locales to include IDs for existing ones
    const localesToUpsert = defaultLocales.map((locale) => {
      const normalizedCode = normalizeLocale(locale.code)
      const existingId = existingByCode.get(normalizedCode)
      return existingId ? { ...locale, id: existingId } : locale
    })

    const resp = await localeService_.upsert(localesToUpsert)
    logger.debug(`Loaded ${resp.length} locales`)
  } catch (error) {
    logger.warn(
      `Failed to load locales, skipping loader. Original error: ${error.message}`
    )
  }
}

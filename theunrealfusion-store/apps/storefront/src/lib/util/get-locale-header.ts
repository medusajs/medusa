import { getLocale } from "@lib/data/locale-actions"

export async function getLocaleHeader() {
  const locale = await getLocale()
  return {
    "x-medusa-locale": locale,
  } as const
}

import { AdminTranslationEntityStatistics, HttpTypes } from "@medusajs/types"
import { Container, Divider, Heading, Text, Tooltip } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

type TranslationsCompletionSectionProps = {
  statistics: Record<string, AdminTranslationEntityStatistics>
  locales: HttpTypes.AdminLocale[]
}

type LocaleStats = {
  code: string
  name: string
  translated: number
  toTranslate: number
  total: number
}

export const TranslationsCompletionSection = ({
  statistics,
  locales,
}: TranslationsCompletionSectionProps) => {
  const { t } = useTranslation()
  const [hoveredLocale, setHoveredLocale] = useState<string | null>(null)

  const { translatedCount, totalCount } = Object.values(statistics).reduce(
    (acc, curr) => ({
      translatedCount: acc.translatedCount + curr.translated,
      totalCount: acc.totalCount + curr.expected,
    }),
    { totalCount: 0, translatedCount: 0 }
  )

  const percentage = totalCount > 0 ? (translatedCount / totalCount) * 100 : 0
  const remaining = Math.max(0, totalCount - translatedCount)

  const localeStats = useMemo((): LocaleStats[] => {
    const localeMap = new Map<
      string,
      { translated: number; expected: number }
    >()

    locales.forEach((locale) => {
      localeMap.set(locale.code, { translated: 0, expected: 0 })
    })

    Object.values(statistics).forEach((entityStats) => {
      if (entityStats.by_locale) {
        Object.entries(entityStats.by_locale).forEach(
          ([localeCode, localeData]) => {
            const existing = localeMap.get(localeCode)
            if (existing) {
              existing.translated += localeData.translated
              existing.expected += localeData.expected
            }
          }
        )
      }
    })

    return locales.map((locale) => {
      const stats = localeMap.get(locale.code) || { translated: 0, expected: 0 }
      return {
        code: locale.code,
        name: locale.name,
        translated: stats.translated,
        toTranslate: Math.max(0, stats.expected - stats.translated),
        total: stats.expected,
      }
    })
  }, [statistics, locales])

  const maxTotal = useMemo(
    () => Math.max(...localeStats.map((s) => s.total), 1),
    [localeStats]
  )

  const localeStatsCount = useMemo(() => localeStats.length, [localeStats])

  return (
    <Container className="p-0">
      <div className="flex flex-col gap-y-4 px-6 py-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">{t("translations.completion.heading")}</Heading>
          <Text size="small" weight="plus" className="text-ui-fg-subtle">
            {translatedCount.toLocaleString()} {t("general.of")}{" "}
            {totalCount.toLocaleString()}
          </Text>
        </div>

        <div className="flex h-3 w-full overflow-hidden">
          {percentage > 0 ? (
            <>
              <div
                className="mr-0.5 h-full rounded-sm transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: "var(--tag-blue-icon)",
                  boxShadow: "inset 0 0 0 0.5px var(--alpha-250)",
                }}
              />
              <div
                className="h-full flex-1 rounded-sm"
                style={{
                  backgroundColor: "var(--tag-blue-border)",
                  boxShadow: "inset 0 0 0 0.5px var(--alpha-250)",
                }}
              />
            </>
          ) : (
            <div
              className="h-full w-full rounded-sm"
              style={{
                backgroundColor: "var(--tag-blue-border)",
                boxShadow: "inset 0 0 0 0.5px var(--alpha-250)",
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Text size="small" weight="plus" className="text-ui-fg-subtle">
            {percentage.toFixed(1)}%
          </Text>
          <Text size="small" weight="plus" className="text-ui-fg-subtle">
            {remaining.toLocaleString()} {t("general.remaining").toLowerCase()}
          </Text>
        </div>
      </div>

      {localeStats.length > 0 && (
        <>
          <Divider variant="dashed" />
          <div className="flex flex-col gap-y-3 px-6 pb-6 pt-4">
            <div className="flex h-32 w-full items-end gap-1">
              {localeStats.map((locale) => {
                const heightPercent = (locale.total / maxTotal) * 100
                const translatedPercent =
                  locale.total > 0
                    ? (locale.translated / locale.total) * 100
                    : 0

                return (
                  <Tooltip
                    key={locale.code}
                    open={hoveredLocale === locale.code}
                    content={
                      <div className="flex min-w-[150px] flex-col gap-y-1 p-1">
                        <Text size="small" weight="plus">
                          {locale.name}
                        </Text>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: "var(--tag-blue-icon)",
                                boxShadow: "inset 0 0 0 0.5px var(--alpha-250)",
                              }}
                            />
                            <Text
                              size="small"
                              weight="plus"
                              className="text-ui-fg-base"
                            >
                              {t("translations.completion.translated")}
                            </Text>
                          </div>
                          <Text
                            size="small"
                            weight="plus"
                            className="text-ui-fg-base"
                          >
                            {locale.translated}
                          </Text>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: "var(--tag-blue-border)",
                                boxShadow: "inset 0 0 0 0.5px var(--alpha-250)",
                              }}
                            />
                            <Text
                              size="small"
                              weight="plus"
                              className="text-ui-fg-base"
                            >
                              {t("translations.completion.toTranslate")}
                            </Text>
                          </div>
                          <Text
                            size="small"
                            weight="plus"
                            className="text-ui-fg-base"
                          >
                            {locale.toTranslate}
                          </Text>
                        </div>
                      </div>
                    }
                  >
                    <div className="flex h-full flex-1 items-end justify-center">
                      <div
                        className="flex w-full min-w-2 max-w-[96px] flex-col justify-end overflow-hidden rounded-t-sm transition-opacity"
                        style={{ height: `${heightPercent}%` }}
                        onMouseEnter={() => setHoveredLocale(locale.code)}
                        onMouseLeave={() => setHoveredLocale(null)}
                      >
                        {translatedPercent === 0 ? (
                          <div
                            className="w-full rounded-sm"
                            style={{
                              height: "100%",
                              backgroundColor: "var(--tag-neutral-bg)",
                              boxShadow: "inset 0 0 0 0.5px var(--alpha-250)",
                            }}
                          />
                        ) : (
                          <>
                            <div
                              className="w-full rounded-sm"
                              style={{
                                height: `${100 - translatedPercent}%`,
                                backgroundColor: "var(--tag-blue-border)",
                                boxShadow: "inset 0 0 0 0.5px var(--alpha-250)",
                                minHeight: locale.toTranslate > 0 ? "2px" : "0",
                              }}
                            />
                            {translatedPercent > 0 && (
                              <div
                                className="mt-0.5 w-full rounded-sm"
                                style={{
                                  height: `${translatedPercent}%`,
                                  backgroundColor: "var(--tag-blue-icon)",
                                  boxShadow:
                                    "inset 0 0 0 0.5px var(--alpha-250)",
                                  minHeight:
                                    locale.translated > 0 ? "2px" : "0",
                                }}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Tooltip>
                )
              })}
            </div>
            {localeStatsCount < 9 && (
              <div className="flex w-full gap-1">
                {localeStats.map((locale) => (
                  <div
                    key={locale.code}
                    className="flex flex-1 items-center justify-center"
                  >
                    <Text
                      size="xsmall"
                      weight="plus"
                      className="text-ui-fg-subtle min-w-2 whitespace-normal break-words text-center leading-tight"
                    >
                      {localeStatsCount < 6 ? locale.name : locale.code}
                    </Text>
                  </div>
                ))}
              </div>
            )}
            {localeStatsCount > 9 && (
              <Text
                weight="plus"
                size="xsmall"
                className="text-ui-fg-subtle text-center"
              >
                {t("translations.completion.footer")}
              </Text>
            )}
          </div>
        </>
      )}
    </Container>
  )
}

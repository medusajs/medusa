import { Language } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, Tooltip } from "@medusajs/ui"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { LinkButton } from "../../../../../components/common/link-button"

type ActiveLocalesSectionProps = {
  locales: HttpTypes.AdminLocale[]
}

export const ActiveLocalesSection = ({
  locales,
}: ActiveLocalesSectionProps) => {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  const renderLocales = useCallback(() => {
    const maxLocalesToDetail = 2
    if (locales.length <= maxLocalesToDetail) {
      return locales.map((locale) => locale.name).join(", ")
    }

    return `${locales
      .slice(0, maxLocalesToDetail)
      .map((locale) => locale.name)
      .join(", ")} + ${locales.length - maxLocalesToDetail}`
  }, [locales])

  const hasLocales = locales.length > 0

  return (
    <Container className="flex flex-col p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("translations.activeLocales.heading")}</Heading>
        <LinkButton
          variant="interactive"
          className="text-ui-fg-subtle hover:text-ui-fg-subtle-hover"
          to="/settings/translations/add-locales"
        >
          {t("translations.activeLocales.noLocalesTipConfigureAction")}
        </LinkButton>
      </div>
      {hasLocales && (
        <div className="px-1 pb-1">
          <Tooltip
            open={isHovered}
            content={
              <div className="flex flex-col gap-y-1 p-1">
                {locales.map((locale) => (
                  <Text
                    key={locale.code}
                    size="base"
                    className="text-ui-fg-subtle"
                  >
                    {locale.name}
                  </Text>
                ))}
              </div>
            }
          >
            <Container
              className="bg-ui-bg-component border-r-1 flex items-center gap-x-4 px-[19px] py-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <IconAvatar className="border-ui-border-base border">
                <Language />
              </IconAvatar>
              <div className="flex flex-col">
                <Text size="small" weight="plus">
                  {t("translations.activeLocales.subtitle")}
                </Text>
                <Text className="text-ui-fg-subtle" size="small">
                  {renderLocales()}
                </Text>
              </div>
            </Container>
          </Tooltip>
        </div>
      )}
    </Container>
  )
}

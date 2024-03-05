import { GlobeEurope } from "@medusajs/icons"
import { Region } from "@medusajs/medusa"
import { Container, Heading, Text, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type TaxCountriesSectionProps = {
  region: Region
}

export const TaxCountriesSection = ({ region }: TaxCountriesSectionProps) => {
  const { t } = useTranslation()

  const countries = region.countries ?? []

  const firstCountries = countries.slice(0, 3)
  const restCountries = countries.slice(3)

  return (
    <Container className="flex flex-col gap-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h2">{t("fields.countries")}</Heading>
      </div>
      <div className="grid grid-cols-[28px_1fr] items-center gap-x-3">
        <div className="bg-ui-bg-base shadow-borders-base flex size-7 items-center justify-center rounded-md">
          <div className="bg-ui-bg-component flex size-6 items-center justify-center rounded-[4px]">
            <GlobeEurope className="text-ui-fg-subtle" />
          </div>
        </div>
        {countries.length > 0 ? (
          <div className="flex items-center gap-x-1">
            <Text size="small" leading="compact">
              {firstCountries.map((sc) => sc.display_name).join(", ")}
            </Text>
            {restCountries.length > 0 && (
              <Tooltip
                content={
                  <ul>
                    {restCountries.map((sc) => (
                      <li key={sc.id}>{sc.display_name}</li>
                    ))}
                  </ul>
                }
              >
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {t("general.plusCountMore", {
                    count: restCountries.length,
                  })}
                </Text>
              </Tooltip>
            )}
          </div>
        ) : (
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("products.noSalesChannels")}
          </Text>
        )}
      </div>
      <div>
        <Text className="text-ui-fg-subtle" size="small" leading="compact">
          Tax rates applies to the above countries.
        </Text>
      </div>
    </Container>
  )
}

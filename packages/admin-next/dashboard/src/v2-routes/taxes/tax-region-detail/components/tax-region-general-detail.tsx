import { TaxRegionResponse } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { formatDate } from "../../../../components/common/date"
import { getCountryByIso2 } from "../../../../lib/countries"

type TaxRegionGeneralDetailProps = {
  taxRegion: TaxRegionResponse
}

export const TaxRegionGeneralDetail = ({
  taxRegion,
}: TaxRegionGeneralDetailProps) => {
  const { t } = useTranslation()
  const countryCode = taxRegion.parent?.country_code || taxRegion.country_code
  const displayName = getCountryByIso2(countryCode)?.display_name || countryCode

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("taxes.domain")}</Heading>

          <Text className="text-ui-fg-subtle" size="small">
            {t("taxes.domainDescription")}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.country")}
        </Text>

        <Text size="small" leading="compact">
          {taxRegion.parent_id ? (
            <Link
              to={`/settings/taxes/${taxRegion.parent_id}`}
              className="text-blue-500 underline"
            >
              {displayName}
            </Link>
          ) : (
            displayName
          )}
        </Text>
      </div>

      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.province")}
        </Text>

        <Text size="small" leading="compact">
          {taxRegion.province_code || "-"}
        </Text>
      </div>

      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.created")}
        </Text>

        <Text size="small" leading="compact">
          {formatDate(taxRegion.created_at)}
        </Text>
      </div>
    </Container>
  )
}

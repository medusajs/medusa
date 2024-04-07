import { TaxRegionDTO } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { formatDate } from "../../../../components/common/date"

type TaxRegionGeneralDetailProps = {
  taxRegion: TaxRegionDTO
}

export const TaxRegionGeneralDetail = ({
  taxRegion,
}: TaxRegionGeneralDetailProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("taxes.domain")}</Heading>

          <Text className="text-ui-fg-subtle" size="small">
            {t("taxes.domainDescription")}
          </Text>
        </div>

        <Link to="/settings/profile/edit">
          <Button size="small" variant="secondary">
            {t("actions.edit")}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.country")}
        </Text>

        <Text size="small" leading="compact">
          {taxRegion.country_code}
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

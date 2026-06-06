import { useTranslation } from "react-i18next"
import { HttpTypes } from "@zjedene-medusa/types"
import { Container, Heading } from "@zjedene-medusa/ui"

import { formatProvider } from "../../../../lib/format-provider"

export function TaxRegionProviderSection({
  taxRegion,
}: {
  taxRegion: HttpTypes.AdminTaxRegion
}) {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <Heading level="h2" className="px-6 py-4">
        {t("taxRegions.provider.header")}
      </Heading>
      <div className="px-6 py-4">
        {taxRegion.provider_id && (
          <span className="text-ui-fg-subtle">
            {formatProvider(taxRegion.provider_id!)}
          </span>
        )}
      </div>
    </Container>
  )
}

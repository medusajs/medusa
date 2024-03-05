import { Region } from "@medusajs/medusa"
import { Container, Heading, Text } from "@medusajs/ui"
import { ActionMenu } from "../../../../../components/common/action-menu"

type TaxDefaultRateSectionProps = {
  region: Region
}

export const TaxDefaultRateSection = ({
  region,
}: TaxDefaultRateSectionProps) => {
  const defaultTaxCode = region.tax_code
  const defaultTaxRate = region.tax_rate

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Default Tax</Heading>
        <ActionMenu groups={[]} />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          Default tax rate
        </Text>
        <Text size="small" leading="compact">
          {defaultTaxRate}%
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          Default tax code
        </Text>
        <Text size="small" leading="compact">
          {defaultTaxCode ?? "-"}
        </Text>
      </div>
    </Container>
  )
}

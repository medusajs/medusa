import { PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"
import { getFormattedCountry } from "../../../../../lib/addresses"
import { useExtension } from "../../../../../providers/extension-provider"
import { usePermissions } from "../../../../../providers/permissions-provider"

type ProductAttributeSectionProps = {
  product: HttpTypes.AdminProduct
}

export const ProductAttributeSection = ({
  product,
}: ProductAttributeSectionProps) => {
  const { t } = useTranslation()
  const { getDisplays } = useExtension()
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission("product:update")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.attributes")}</Heading>
        {canUpdate && (
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    to: "attributes",
                    icon: <PencilSquare />,
                  },
                ],
              },
            ]}
          />
        )}
      </div>
      <SectionRow title={t("fields.height")} value={product.height} />
      <SectionRow title={t("fields.width")} value={product.width} />
      <SectionRow title={t("fields.length")} value={product.length} />
      <SectionRow title={t("fields.weight")} value={product.weight} />
      <SectionRow title={t("fields.midCode")} value={product.mid_code} />
      <SectionRow title={t("fields.hsCode")} value={product.hs_code} />
      <SectionRow
        title={t("fields.countryOfOrigin")}
        value={getFormattedCountry(product.origin_country)}
      />
      {getDisplays("product", "attributes").map((Component, i) => {
        return <Component key={i} data={product} />
      })}
    </Container>
  )
}

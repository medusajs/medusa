import { PencilSquare } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type ProductAttributeSectionProps = {
  product: Product
}

export const ProductAttributeSection = ({
  product,
}: ProductAttributeSectionProps) => {
  const { t } = useTranslation()

  const attributes: { field: keyof Product; label: string }[] = [
    {
      field: "height",
      label: t("fields.height"),
    },
    {
      field: "width",
      label: t("fields.width"),
    },
    {
      field: "length",
      label: t("fields.length"),
    },
    {
      field: "weight",
      label: t("fields.weight"),
    },
    {
      field: "mid_code",
      label: t("fields.midCode"),
    },
    {
      field: "hs_code",
      label: t("fields.hsCode"),
    },
    {
      field: "origin_country",
      label: t("fields.countryOfOrigin"),
    },
  ]

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.attributes")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("general.edit"),
                  icon: <PencilSquare />,
                  to: "attributes",
                },
              ],
            },
          ]}
        />
      </div>
      {attributes.map((attr) => {
        const value = product[attr.field] as string | number | undefined | null

        return (
          <div
            key={attr.field}
            className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4"
          >
            <Text size="small" weight="plus" leading="compact">
              {attr.label}
            </Text>
            <Text size="small" leading="compact">
              {value ?? "-"}
            </Text>
          </div>
        )
      })}
    </Container>
  )
}

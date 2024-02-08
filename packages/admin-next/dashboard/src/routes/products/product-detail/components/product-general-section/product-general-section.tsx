import { PencilSquare, Trash } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import { Container, Heading, StatusBadge, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type ProductGeneralSectionProps = {
  product: Product
}

export const ProductGeneralSection = ({
  product,
}: ProductGeneralSectionProps) => {
  const { t } = useTranslation()

  const [color, status] = {
    draft: ["grey", t("products.productStatus.draft")],
    published: ["green", t("products.productStatus.published")],
    proposed: ["orange", t("products.productStatus.proposed")],
    rejected: ["red", t("products.productStatus.rejected")],
  }[product.status] as ["grey" | "green" | "orange" | "red", string]

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{product.title}</Heading>
        <div className="flex items-center gap-x-2">
          <StatusBadge color={color}>{status}</StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <PencilSquare />,
                    label: t("general.edit"),
                    to: "edit",
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("general.delete"),
                    icon: <Trash />,
                    onClick: () => {},
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {product.description ?? "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.subtitle")}
        </Text>
        <Text size="small" leading="compact">
          {product.subtitle ?? "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.handle")}
        </Text>
        <Text size="small" leading="compact">
          /{product.handle}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.material")}
        </Text>
        <Text size="small" leading="compact">
          {product.material ?? "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.discountable")}
        </Text>
        <Text size="small" leading="compact">
          {product.discountable ? t("fields.true") : t("fields.false")}
        </Text>
      </div>
    </Container>
  )
}

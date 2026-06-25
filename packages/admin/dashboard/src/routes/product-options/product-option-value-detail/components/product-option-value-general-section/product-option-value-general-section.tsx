import { Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteProductOptionValueAction } from "../../../common/hooks/use-delete-product-option-value-action.tsx"

export const ProductOptionValueGeneralSection = ({
  optionId,
  productOptionValue,
}: {
  optionId: string
  productOptionValue: HttpTypes.AdminProductOptionValue
}) => {
  const { t } = useTranslation()

  const handleDelete = useDeleteProductOptionValueAction(
    optionId,
    productOptionValue,
    { redirectOnSuccess: true }
  )

  return (
    <Container className="flex items-center justify-between">
      <Heading>{productOptionValue.value}</Heading>
      <ActionMenu
        groups={[
          {
            actions: [
              {
                label: t("actions.delete"),
                icon: <Trash />,
                onClick: handleDelete,
              },
            ],
          },
        ]}
      />
    </Container>
  )
}

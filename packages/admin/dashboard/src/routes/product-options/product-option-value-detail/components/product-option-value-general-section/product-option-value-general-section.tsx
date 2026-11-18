import { Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { usePermissions } from "../../../../../providers/permissions-provider"
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
  const { hasAllPermissions } = usePermissions()
  const canDelete = hasAllPermissions([
    "product_option:update",
    "product_option_value:delete",
  ])

  return (
    <Container className="flex items-center justify-between">
      <Heading>{productOptionValue.value}</Heading>
      {canDelete && (
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
      )}
    </Container>
  )
}

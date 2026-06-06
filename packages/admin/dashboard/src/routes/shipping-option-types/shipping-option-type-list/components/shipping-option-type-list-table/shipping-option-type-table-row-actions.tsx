import { PencilSquare, Trash } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteShippingOptionTypeAction } from "../../../common/hooks/use-delete-shipping-option-type-action"

type ShippingOptionTypeRowActionsProps = {
  shippingOptionType: HttpTypes.AdminShippingOptionType
}

export const ShippingOptionTypeRowActions = ({
  shippingOptionType,
}: ShippingOptionTypeRowActionsProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteShippingOptionTypeAction(
    shippingOptionType.id,
    shippingOptionType.label
  )

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `/settings/locations/shipping-option-types/${shippingOptionType.id}/edit`,
            },
          ],
        },
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
  )
}

import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useShippingOptionTypePermissions } from "../../../../../hooks/use-resource-permissions"
import { useDeleteShippingOptionTypeAction } from "../../../common/hooks/use-delete-shipping-option-type-action"

type ShippingOptionTypeGeneralSectionProps = {
  shippingOptionType: HttpTypes.AdminShippingOptionType
}

export const ShippingOptionTypeGeneralSection = ({
  shippingOptionType,
}: ShippingOptionTypeGeneralSectionProps) => {
  const { t } = useTranslation()
  const { canUpdate, canDelete } = useShippingOptionTypePermissions()
  const handleDelete = useDeleteShippingOptionTypeAction(
    shippingOptionType.id,
    shippingOptionType.label
  )

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          label: t("actions.edit"),
          icon: <PencilSquare />,
          to: "edit",
        },
      ],
    })
  }

  if (canDelete) {
    groups.push({
      actions: [
        {
          label: t("actions.delete"),
          icon: <Trash />,
          onClick: handleDelete,
        },
      ],
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between  px-6 py-4">
        <Heading>{shippingOptionType.label}</Heading>
        {groups.length > 0 && <ActionMenu groups={groups} />}
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.code")}
        </Text>
        <Text size="small" leading="compact">
          {shippingOptionType.code}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact">
          {shippingOptionType.description || "-"}
        </Text>
      </div>
    </Container>
  )
}

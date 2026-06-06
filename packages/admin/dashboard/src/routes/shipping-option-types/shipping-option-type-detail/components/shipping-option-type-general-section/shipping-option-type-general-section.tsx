import { PencilSquare, Trash } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import { Container, Heading, Text } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteShippingOptionTypeAction } from "../../../common/hooks/use-delete-shipping-option-type-action"

type ShippingOptionTypeGeneralSectionProps = {
  shippingOptionType: HttpTypes.AdminShippingOptionType
}

export const ShippingOptionTypeGeneralSection = ({
  shippingOptionType,
}: ShippingOptionTypeGeneralSectionProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeleteShippingOptionTypeAction(
    shippingOptionType.id,
    shippingOptionType.label
  )

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between  px-6 py-4">
        <Heading>{shippingOptionType.label}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  icon: <PencilSquare />,
                  to: "edit",
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

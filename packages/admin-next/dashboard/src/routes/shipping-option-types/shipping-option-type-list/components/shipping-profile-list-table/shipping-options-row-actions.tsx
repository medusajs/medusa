import { Trash } from "@medusajs/icons"
import { AdminShippingOptionTypeResponse } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteShippingOptionType } from "../../../../../hooks/api/shipping-option-types"

export const ShippingOptionsRowActions = ({
  optionType,
}: {
  optionType: AdminShippingOptionTypeResponse["shipping_option_type"]
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteShippingOptionType(optionType.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("shippingProfile.delete.title"),
      description: t("shippingProfile.delete.description", {
        name: optionType.label,
      }),
      verificationText: optionType.label,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("shippingProfile.delete.successToast", {
            name: optionType.label,
          }),
          dismissLabel: t("actions.close"),
        })
      },
      onError: (error) => {
        toast.error(t("general.error"), {
          description: error.message,
          dismissLabel: t("actions.close"),
        })
      },
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

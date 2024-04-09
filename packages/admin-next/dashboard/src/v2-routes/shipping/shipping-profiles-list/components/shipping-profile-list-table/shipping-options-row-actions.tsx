import { Trash } from "@medusajs/icons"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ShippingProfileDTO } from "@medusajs/types"

import { ActionMenu } from "../../../../../components/common/action-menu"

export const ShippingOptionsRowActions = ({
  profile,
}: {
  profile: ShippingProfileDTO
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = {} // useDeleteShippingProfile(profile.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("shippingProfile.deleteWaring", {
        name: profile.name,
      }),
      verificationText: profile.name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
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

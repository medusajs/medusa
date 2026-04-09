import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteCollection } from "../../../../../hooks/api/collections"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

export const CollectionRowActions = ({
  collection,
}: {
  collection: HttpTypes.AdminCollection
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const isTranslationsEnabled = useFeatureFlag("translation")

  const { mutateAsync } = useDeleteCollection(collection.id!)

  const handleDeleteCollection = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.deleteWarning", {
        title: collection.title,
      }),
      verificationText: collection.title,
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
              label: t("actions.edit"),
              to: `/collections/${collection.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        ...(isTranslationsEnabled
          ? [
              {
                actions: [
                  {
                    icon: <GlobeEurope />,
                    label: t("translations.actions.manage"),
                    to: `/settings/translations/edit?reference=product_collection&reference_id=${collection.id}`,
                  },
                ],
              },
            ]
          : []),
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDeleteCollection,
              icon: <Trash />,
              disabled: !collection.id,
            },
          ],
        },
      ]}
    />
  )
}

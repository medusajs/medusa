import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteCollection } from "../../../../../hooks/api/collections"
import {
  useProductCollectionPermissions,
  useTranslationPermissions,
} from "../../../../../hooks/use-resource-permissions"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

export const CollectionRowActions = ({
  collection,
}: {
  collection: HttpTypes.AdminCollection
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const isTranslationsEnabled = useFeatureFlag("translation")
  const { canUpdate, canDelete } = useProductCollectionPermissions()
  const { canUpdate: canUpdateTranslations } = useTranslationPermissions()

  const canManageTranslations = isTranslationsEnabled && canUpdateTranslations

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

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          label: t("actions.edit"),
          to: `/collections/${collection.id}/edit`,
          icon: <PencilSquare />,
        },
      ],
    })
  }

  if (canManageTranslations) {
    groups.push({
      actions: [
        {
          icon: <GlobeEurope />,
          label: t("translations.actions.manage"),
          to: `/settings/translations/edit?reference=product_collection&reference_id=${collection.id}`,
        },
      ],
    })
  }

  if (canDelete) {
    groups.push({
      actions: [
        {
          label: t("actions.delete"),
          onClick: handleDeleteCollection,
          icon: <Trash />,
          disabled: !collection.id,
        },
      ],
    })
  }

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}

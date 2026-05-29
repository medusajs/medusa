import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteCollection } from "../../../../../hooks/api/collections"
import { useNavigate } from "react-router-dom"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { usePermissions } from "../../../../../providers/permissions-provider"

type CollectionGeneralSectionProps = {
  collection: HttpTypes.AdminCollection
}

export const CollectionGeneralSection = ({
  collection,
}: CollectionGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const isTranslationsEnabled = useFeatureFlag("translation")
  const { hasPermission } = usePermissions()

  const canUpdate = hasPermission("product_collection:update")
  const canDelete = hasPermission("product_collection:delete")
  const canManageTranslations =
    isTranslationsEnabled && hasPermission("translation:update")

  const { mutateAsync } = useDeleteCollection(collection.id!)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.deleteWarning", {
        count: 1,
        title: collection.title,
      }),
    })

    if (!res) {
      return
    }

    await mutateAsync()
    navigate("../", { replace: true })
  }

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `/collections/${collection.id}/edit`,
          disabled: !collection.id,
        },
      ],
    })
  }

  if (canManageTranslations) {
    groups.push({
      actions: [
        {
          label: t("translations.actions.manage"),
          to: `/settings/translations/edit?reference=product_collection&reference_id=${collection.id}`,
          icon: <GlobeEurope />,
        },
      ],
    })
  }

  if (canDelete) {
    groups.push({
      actions: [
        {
          icon: <Trash />,
          label: t("actions.delete"),
          onClick: handleDelete,
          disabled: !collection.id,
        },
      ],
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{collection.title}</Heading>
        {groups.length > 0 && <ActionMenu groups={groups} />}
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.handle")}
        </Text>
        <Text size="small">/{collection.handle}</Text>
      </div>
    </Container>
  )
}

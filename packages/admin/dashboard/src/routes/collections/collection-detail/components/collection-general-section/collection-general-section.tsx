import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteCollection } from "../../../../../hooks/api/collections"
import { useNavigate } from "react-router-dom"

type CollectionGeneralSectionProps = {
  collection: HttpTypes.AdminCollection
}

export const CollectionGeneralSection = ({
  collection,
}: CollectionGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

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

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{collection.title}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `/collections/${collection.id}/edit`,
                  disabled: !collection.id,
                },
              ],
            },
            {
              actions: [
                {
                  icon: <Trash />,
                  label: t("actions.delete"),
                  onClick: handleDelete,
                  disabled: !collection.id,
                },
              ],
            },
          ]}
        />
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

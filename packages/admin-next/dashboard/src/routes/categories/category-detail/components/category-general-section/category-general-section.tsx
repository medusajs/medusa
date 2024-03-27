import { PencilSquare, Trash } from "@medusajs/icons"
import { ProductCategory } from "@medusajs/medusa"
import { Container, Heading, Text, usePrompt } from "@medusajs/ui"
import { useAdminDeleteProductCategory } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { CategoryStatusBadge } from "../../../common/components/category-status-badge"
import { CategoryVisibilityBadge } from "../../../common/components/category-visibility-badge"

type CategoryGeneralSectionProps = {
  category: ProductCategory
}

export const CategoryGeneralSection = ({
  category,
}: CategoryGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteProductCategory(category.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.deleteWarning", {
        name: category.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onError: () => {
        // show toast that it is not possible to delete
        // a category with children.
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{category.name}</Heading>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-1">
            <CategoryStatusBadge isActive={category.is_active as boolean} />
            <CategoryVisibilityBadge
              isInternal={category.is_internal as boolean}
            />
          </div>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    to: `edit`,
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
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.handle")}
        </Text>
        <Text size="small" leading="compact">
          /{category.handle}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {category.description || "-"}
        </Text>
      </div>
    </Container>
  )
}

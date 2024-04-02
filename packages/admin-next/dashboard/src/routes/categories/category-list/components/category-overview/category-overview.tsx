import { PencilSquare, Plus, Trash } from "@medusajs/icons"
import { ProductCategory } from "@medusajs/medusa"
import { Button, Container, Heading, usePrompt } from "@medusajs/ui"
import dropRight from "lodash/dropRight"
import flatMap from "lodash/flatMap"
import get from "lodash/get"
import {
  adminProductCategoryKeys,
  useAdminDeleteProductCategory,
  useAdminProductCategories,
  useMedusa,
} from "medusa-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { useState } from "react"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { queryClient } from "../../../../../lib/medusa"
import { CategoryTree } from "../../../common/components/category-tree"

export const CategoryOverview = () => {
  const { t } = useTranslation()
  const [isMutating, setIsMutating] = useState(false)

  const { product_categories, isLoading, isError, error } =
    useAdminProductCategories({
      include_descendants_tree: true,
      parent_category_id: "null",
    })

  const { client } = useMedusa()

  const handlePositionChange = async ({
    dragItem,
    items,
    targetPath,
  }: {
    dragItem: ProductCategory
    items: ProductCategory[]
    targetPath: number[]
  }) => {
    setIsMutating(true)

    let parentId = null
    const [rank] = targetPath.slice(-1)

    if (targetPath.length > 1) {
      const path = dropRight(
        flatMap(targetPath.slice(0, -1), (item) => [item, "category_children"])
      )

      const newParent = get(items, path) as ProductCategory
      parentId = newParent.id
    }

    await client.admin.productCategories
      .update(dragItem.id, {
        parent_category_id: parentId,
        rank,
      })
      .then(() => {
        queryClient.invalidateQueries(adminProductCategoryKeys.lists())
        queryClient.invalidateQueries(adminProductCategoryKeys.details())
      })
      .finally(() => {
        setIsMutating(false)
      })
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("categories.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <CategoryTree
        productCategories={product_categories}
        onChange={handlePositionChange}
        itemMenu={ItemMenu}
        isLoading={isLoading}
        isDisabled={isMutating || isLoading}
        asLink
      />
    </Container>
  )
}

const ItemMenu = ({
  item,
  isDisabled,
}: {
  item: ProductCategory
  isDisabled?: boolean
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteProductCategory(item.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.deleteWarning", {
        name: item.name,
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
    <ActionMenu
      disabled={isDisabled}
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              icon: <PencilSquare />,
              to: `${item.id}/edit`,
            },
            {
              label: "Create subcategory",
              icon: <Plus />,
              to: `create`,
              state: { parent_id: item.id },
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

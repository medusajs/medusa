import { ProductCategory } from "@medusajs/medusa"
import dropRight from "lodash/dropRight"
import flatMap from "lodash/flatMap"
import get from "lodash/get"
import { useAdminUpdateProductCategory } from "medusa-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { CategoryTree } from "../../../common/components/category-tree"

type EditCategoryRankFormProps = {
  category: ProductCategory
  categories?: ProductCategory[]
  isLoading: boolean
}

const EditCategoryRankSchema = z.object({
  parent_category_id: z.string().nullable(),
  rank: z.number().optional(),
})

export const EditCategoryRankForm = ({
  category,
  categories,
  isLoading,
}: EditCategoryRankFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditCategoryRankSchema>>({
    defaultValues: {
      parent_category_id: category.parent_category_id,
      rank: category.rank,
    },
  })
  const { setValue } = form

  const { mutateAsync, isLoading: isUpdating } = useAdminUpdateProductCategory(
    category.id
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    mutateAsync(
      {
        parent_category_id: data.parent_category_id,
        rank: data.rank,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  const handlePositionChange = async ({
    dragItem: _dragItem,
    items,
    targetPath,
  }: {
    dragItem: ProductCategory
    items: ProductCategory[]
    targetPath: number[]
  }) => {
    let parentId = null
    const [rank] = targetPath.slice(-1)

    if (targetPath.length > 1) {
      const path = dropRight(
        flatMap(targetPath.slice(0, -1), (item) => [item, "category_children"])
      )

      const newParent = get(items, path) as ProductCategory
      parentId = newParent.id
    }

    setValue("parent_category_id", parentId, {
      shouldDirty: true,
      shouldTouch: true,
    })
    setValue("rank", rank, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isUpdating}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex size-full flex-col overflow-auto">
          <CategoryTree
            productCategories={categories}
            isLoading={isLoading}
            onChange={handlePositionChange}
            enableDrag={(item) => item.id === category.id}
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

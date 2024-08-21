import { UniqueIdentifier } from "@dnd-kit/core"
import { Badge } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"

import { useTranslation } from "react-i18next"
import { useProductCategories } from "../../../../../hooks/api/categories"
import { CategoryTree } from "../../../common/components/category-tree"
import { CategoryTreeItem } from "../../../common/types"
import { insertCategoryTreeItem } from "../../../common/utils"
import { CreateCategorySchema } from "./schema"

type CreateCategoryNestingProps = {
  form: UseFormReturn<CreateCategorySchema>
  shouldFreeze?: boolean
}

const ID = "new-item"

export const CreateCategoryNesting = ({
  form,
  shouldFreeze,
}: CreateCategoryNestingProps) => {
  const { t } = useTranslation()
  const [snapshot, setSnapshot] = useState<CategoryTreeItem[]>([])

  const { product_categories, isPending, isError, error } =
    useProductCategories({
      parent_category_id: "null",
      limit: 9999,
      fields: "id,name,parent_category_id,rank,category_children,rank",
      include_descendants_tree: true,
    })

  const parentCategoryId = useWatch({
    control: form.control,
    name: "parent_category_id",
  })

  const watchedRank = useWatch({
    control: form.control,
    name: "rank",
  })

  const watchedName = useWatch({
    control: form.control,
    name: "name",
  })

  const value = useMemo(() => {
    const temp = {
      id: ID,
      name: watchedName,
      parent_category_id: parentCategoryId,
      rank: watchedRank,
      category_children: null,
    }

    return insertCategoryTreeItem(product_categories ?? [], temp)
  }, [product_categories, watchedName, parentCategoryId, watchedRank])

  const handleChange = (
    {
      parentId,
      index,
    }: {
      id: UniqueIdentifier
      parentId: UniqueIdentifier | null
      index: number
    },
    list: CategoryTreeItem[]
  ) => {
    form.setValue("parent_category_id", parentId as string | null, {
      shouldDirty: true,
      shouldTouch: true,
    })

    form.setValue("rank", index, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setSnapshot(list)
  }

  if (isError) {
    throw error
  }

  const ready = !isPending && !!product_categories

  return (
    <CategoryTree
      value={shouldFreeze ? snapshot : value}
      enableDrag={(item) => item.id === ID}
      onChange={handleChange}
      renderValue={(item) => {
        if (item.id === ID) {
          return (
            <div className="flex items-center gap-x-3">
              <span>{item.name}</span>
              <Badge size="2xsmall" color="blue">
                {t("categories.fields.new.label")}
              </Badge>
            </div>
          )
        }

        return item.name
      }}
      isLoading={!ready}
    />
  )
}

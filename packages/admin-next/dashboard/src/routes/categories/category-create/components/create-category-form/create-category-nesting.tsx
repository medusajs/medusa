import { useMemo, useState } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
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
  const [snapshot, setSnapshot] = useState<CategoryTreeItem[]>([])

  const { product_categories, isPending, isError, error } =
    useProductCategories(
      {
        parent_category_id: "null",
        limit: 9999,
        fields: "id,name,parent_category_id,rank,category_children",
        include_descendants_tree: true,
      },
      {
        refetchInterval: Infinity, // Once the data is loaded we don't need to refetch
      }
    )

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
    { parent_category_id, rank }: CategoryTreeItem,
    list: CategoryTreeItem[]
  ) => {
    form.setValue("parent_category_id", parent_category_id, {
      shouldDirty: true,
      shouldTouch: true,
    })

    form.setValue("rank", rank, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setSnapshot(list)
  }

  if (isError) {
    throw error
  }

  return (
    <CategoryTree
      // When we submit the form we want to freeze the rendered tree to prevent flickering during the exit animation
      value={shouldFreeze ? snapshot : value}
      onChange={handleChange}
      enableDrag={(i) => i.id === ID}
      showBadge={(i) => i.id === ID}
      isLoading={isPending || !product_categories}
    />
  )
}

import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useProductCategories } from "../../../../../hooks/api/categories"
import {
  CategoryTree,
  CategoryTreeItem,
} from "../../../common/components/category-tree"
import { CreateCategorySchema } from "./schema"

type CreateCategoryNestingProps = {
  form: UseFormReturn<CreateCategorySchema>
}

const ID = "new-item"

export const CreateCategoryNesting = ({ form }: CreateCategoryNestingProps) => {
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
    }

    console.log("inserting", temp)

    return insertCategoryTreeItem(product_categories ?? [], temp)
  }, [product_categories, watchedName, parentCategoryId, watchedRank])

  const handleChange = ({ parent_category_id, rank }: CategoryTreeItem) => {
    form.setValue("parent_category_id", parent_category_id, {
      shouldDirty: true,
      shouldTouch: true,
    })

    console.log("rank", rank)
    form.setValue("rank", rank, {
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  if (isError) {
    throw error
  }

  return (
    <CategoryTree
      value={value}
      onChange={handleChange}
      enableDrag={(i) => i.id === ID}
      showBadge={(i) => i.id === ID}
      isLoading={isPending || !product_categories}
    />
  )
}

/**
 * Since we allow the user to go back and forth between the two steps of the form,
 * we need to handle restoring the state of the tree when it re-renders.
 */
const insertCategoryTreeItem = (
  categories: CategoryTreeItem[],
  newItem: Omit<CategoryTreeItem, "category_children">
): CategoryTreeItem[] => {
  const seen = new Set<string>()

  const remove = (
    items: CategoryTreeItem[],
    id: string
  ): CategoryTreeItem[] => {
    const stack = [...items]
    const result: CategoryTreeItem[] = []

    while (stack.length > 0) {
      const item = stack.pop()!
      if (item.id !== id) {
        if (item.category_children) {
          item.category_children = remove(item.category_children, id)
        }
        result.push(item)
      }
    }

    return result
  }

  const insert = (items: CategoryTreeItem[]): CategoryTreeItem[] => {
    const stack = [...items]

    while (stack.length > 0) {
      const item = stack.pop()!
      if (seen.has(item.id)) {
        continue // Prevent revisiting the same node
      }
      seen.add(item.id)

      if (item.id === newItem.parent_category_id) {
        if (!item.category_children) {
          item.category_children = []
        }
        item.category_children.push({ ...newItem, category_children: null })
        item.category_children.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
        return categories
      }
      if (item.category_children) {
        stack.push(...item.category_children)
      }
    }
    return items
  }

  categories = remove(categories, newItem.id)

  if (newItem.parent_category_id === null && newItem.rank === null) {
    categories.unshift({ ...newItem, category_children: null })
  } else if (newItem.parent_category_id === null && newItem.rank !== null) {
    categories.splice(newItem.rank, 0, {
      ...newItem,
      category_children: null,
    })
  } else {
    categories = insert(categories)
  }

  categories.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))

  return categories
}

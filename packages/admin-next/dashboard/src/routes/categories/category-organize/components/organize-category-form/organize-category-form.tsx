import { keepPreviousData } from "@tanstack/react-query"

import { Spinner } from "@medusajs/icons"
import { FetchError } from "@medusajs/js-sdk"
import { useState } from "react"
import { RouteFocusModal } from "../../../../../components/route-modal"
import {
  categoriesQueryKeys,
  useProductCategories,
} from "../../../../../hooks/api/categories"
import { sdk } from "../../../../../lib/client"
import { queryClient } from "../../../../../lib/query-client"
import {
  CategoryTree,
  CategoryTreeItem,
} from "../../../common/components/category-tree"

type OrganizeCategoryFormProps = {
  categoryId?: string
}

export const OrganizeCategoryForm = ({
  categoryId,
}: OrganizeCategoryFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<FetchError | null>(null)

  const {
    product_categories,
    isPending,
    isError,
    error: fetchError,
  } = useProductCategories(
    {
      fields: "id,name,parent_category_id,rank,*category_children",
      parent_category_id: "null",
      include_descendants_tree: true,
      limit: 9999,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const handleRankChange = async (value: CategoryTreeItem) => {
    setIsLoading(true)

    await sdk.admin.productCategory
      .update(value.id, {
        rank: value.rank ?? 0,
        parent_category_id: value.parent_category_id,
      })
      .then(async () => {
        await queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.lists(),
        })
        await queryClient.invalidateQueries({
          queryKey: categoriesQueryKeys.detail(value.id),
        })
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const loading = isPending || isLoading

  if (isError) {
    throw fetchError
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <RouteFocusModal.Header>
        <div className="flex items-center justify-end">
          {loading && <Spinner className="animate-spin" />}
        </div>
      </RouteFocusModal.Header>
      <RouteFocusModal.Body className="bg-ui-bg-subtle flex flex-1 flex-col overflow-y-auto">
        <CategoryTree
          value={product_categories || []}
          onChange={handleRankChange}
        />
      </RouteFocusModal.Body>
    </div>
  )
}

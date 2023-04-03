import { useMemo } from "react"

import {
  useAdminCollections,
  useAdminProductCategories,
  useAdminProductTypes,
} from "medusa-react"

import { NestedMultiselectOption } from "../../../../domain/categories/components/multiselect"
import { transformCategoryToNestedFormOptions } from "../../../../domain/categories/utils/transform-response"
import {
  FeatureFlag,
  useFeatureFlag,
} from "../../../../providers/feature-flag-provider"

const useOrganizeData = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { product_types } = useAdminProductTypes(undefined, {
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
  const { collections } = useAdminCollections()
  const { product_categories: categories = [] } = useAdminProductCategories(
    {
      parent_category_id: "null",
      include_descendants_tree: true,
    },
    {
      enabled: isFeatureEnabled(FeatureFlag.PRODUCT_CATEGORIES),
    }
  )

  const productTypeOptions = useMemo(() => {
    return (
      product_types?.map(({ id, value }) => ({
        value: id,
        label: value,
      })) || []
    )
  }, [product_types])

  const collectionOptions = useMemo(() => {
    return (
      collections?.map(({ id, title }) => ({
        value: id,
        label: title,
      })) || []
    )
  }, [collections])

  const categoriesOptions: NestedMultiselectOption[] | undefined = useMemo(
    () => categories?.map(transformCategoryToNestedFormOptions),
    [categories]
  )

  return {
    productTypeOptions,
    collectionOptions,
    categoriesOptions,
  }
}

export default useOrganizeData

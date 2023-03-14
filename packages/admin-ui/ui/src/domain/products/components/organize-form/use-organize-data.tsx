import { useMemo } from "react"

import {
  useAdminCollections,
  useAdminProductCategories,
  useAdminProductTypes,
} from "medusa-react"

import { NestedMultiselectOption } from "../../../categories/components/multiselect"
import { transformCategoryToNestedFormOptions } from "../../../categories/utils/transform-response"
import {
  useFeatureFlag,
  FeatureFlag,
} from "../../../../providers/feature-flag-provider"

const useOrganizeData = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { product_types } = useAdminProductTypes(undefined, {
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
  const { collections } = useAdminCollections()
  const { product_categories: categories = [] } =
    isFeatureEnabled(FeatureFlag.PRODUCT_CATEGORIES) &&
    useAdminProductCategories({
      parent_category_id: "null",
      include_descendants_tree: true,
    })

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

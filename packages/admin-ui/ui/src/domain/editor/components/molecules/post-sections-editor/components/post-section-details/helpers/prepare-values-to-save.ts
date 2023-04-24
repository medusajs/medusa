import merge from "lodash/merge"
import { PostSectionType } from "../../../../../../../../types/shared"
import { PostSectionFormValues, ProductListFormValues } from "../../../types"

const prepareProductListFormValues = (values: ProductListFormValues) =>
  merge(values, {
    content: {
      ...values.content,
      collection_tab_id:
        values.content?.collection_tab_id?.map((c) => c.value) || null,
    },
  })

export const prepareValuesToSave = (values: PostSectionFormValues) => {
  switch (values.type) {
    case PostSectionType.PRODUCT_CAROUSEL:
      return prepareProductListFormValues(values as ProductListFormValues)
    case PostSectionType.PRODUCT_GRID:
      return prepareProductListFormValues(values as ProductListFormValues)

    default:
      return values
  }
}

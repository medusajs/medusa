import details from "virtual:medusa/details/product/general"

const extendedFields = details.blocks
  .map((block) => {
    return block.extendQuery?.fields
  })
  .join(",")

export const PRODUCT_DETAIL_FIELDS = ["*categories", extendedFields].join(",")

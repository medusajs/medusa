enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

export const getTitle = (view: DiscountConditionType) => {
  switch (view) {
    case DiscountConditionType.PRODUCTS:
      return "products"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "groups"
    case DiscountConditionType.PRODUCT_TAGS:
      return "tags"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "collections"
    case DiscountConditionType.PRODUCT_TYPES:
      return "types"
  }
}

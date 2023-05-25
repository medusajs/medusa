import { TFunction } from "i18next"

enum DiscountConditionType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  PRODUCT_COLLECTIONS = "product_collections",
  PRODUCT_TAGS = "product_tags",
  CUSTOMER_GROUPS = "customer_groups",
}

export const getTitle = (view: DiscountConditionType, t: TFunction) => {
  switch (view) {
    case DiscountConditionType.PRODUCTS:
      return t("products")
    case DiscountConditionType.CUSTOMER_GROUPS:
      return t("groups")
    case DiscountConditionType.PRODUCT_TAGS:
      return t("tags")
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return t("collections")
    case DiscountConditionType.PRODUCT_TYPES:
      return t("types")
  }
}

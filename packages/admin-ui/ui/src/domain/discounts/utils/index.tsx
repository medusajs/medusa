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
      return t("utils-products", "products")
    case DiscountConditionType.CUSTOMER_GROUPS:
      return t("utils-groups", "groups")
    case DiscountConditionType.PRODUCT_TAGS:
      return t("utils-tags", "tags")
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return t("utils-collections", "collections")
    case DiscountConditionType.PRODUCT_TYPES:
      return t("utils-types", "types")
  }
}

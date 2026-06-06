import {
  CommonEvents,
  moduleEventBuilderFactory,
  Modules,
  ProductEvents,
} from "@zjedene-medusa/framework/utils"

export const eventBuilders = {
  createdProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_category",
    eventName: ProductEvents.PRODUCT_CATEGORY_CREATED,
  }),
  updatedProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_category",
    eventName: ProductEvents.PRODUCT_CATEGORY_UPDATED,
  }),
  deletedProductCategory: moduleEventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_category",
    eventName: ProductEvents.PRODUCT_CATEGORY_DELETED,
  }),
}

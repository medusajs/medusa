import {
  CommonEvents,
  eventBuilderFactory,
  Modules,
  ProductEvents,
} from "@medusajs/utils"

export const eventBuilders = {
  createdProduct: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  updatedProduct: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  deletedProduct: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  createdProductVariant: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  updatedProductVariant: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  deletedProductVariant: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  createdProductOption: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  updatedProductOption: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  deletedProductOption: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  createdProductType: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  updatedProductType: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  deletedProductType: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  createdProductTag: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
  updatedProductTag: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
  deletedProductTag: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
  createdProductCategory: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_category",
    eventsEnum: ProductEvents,
  }),
  updatedProductCategory: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_category",
    eventsEnum: ProductEvents,
  }),
  deletedProductCategory: eventBuilderFactory({
    source: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_category",
    eventsEnum: ProductEvents,
  }),
}

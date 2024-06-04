import {
  CommonEvents,
  eventBuilderFactory,
  Modules,
  ProductEvents,
} from "@medusajs/utils"

export const eventBuilders = {
  createdProduct: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  updatedProduct: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  deletedProduct: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product",
    eventsEnum: ProductEvents,
  }),
  createdProductVariant: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product-variant",
    eventsEnum: ProductEvents,
  }),
  updatedProductVariant: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product-variant",
    eventsEnum: ProductEvents,
  }),
  deletedProductVariant: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product-variant",
    eventsEnum: ProductEvents,
  }),
  createdProductOption: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product-option",
    eventsEnum: ProductEvents,
  }),
  updatedProductOption: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product-option",
    eventsEnum: ProductEvents,
  }),
  deletedProductOption: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product-option",
    eventsEnum: ProductEvents,
  }),
  createdProductType: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product-type",
    eventsEnum: ProductEvents,
  }),
  updatedProductType: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product-type",
    eventsEnum: ProductEvents,
  }),
  deletedProductType: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product-type",
    eventsEnum: ProductEvents,
  }),
  createdProductTag: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product-tag",
    eventsEnum: ProductEvents,
  }),
  updatedProductTag: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product-tag",
    eventsEnum: ProductEvents,
  }),
  deletedProductTag: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product-tag",
    eventsEnum: ProductEvents,
  }),
}

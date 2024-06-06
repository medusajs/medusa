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
    isMainEntity: true,
  }),
  updatedProduct: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product",
    eventsEnum: ProductEvents,
    isMainEntity: true,
  }),
  deletedProduct: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product",
    eventsEnum: ProductEvents,
    isMainEntity: true,
  }),
  createdProductVariant: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  updatedProductVariant: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  deletedProductVariant: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_variant",
    eventsEnum: ProductEvents,
  }),
  createdProductOption: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  updatedProductOption: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  deletedProductOption: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_option",
    eventsEnum: ProductEvents,
  }),
  createdProductType: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  updatedProductType: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  deletedProductType: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_type",
    eventsEnum: ProductEvents,
  }),
  createdProductTag: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.CREATED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
  updatedProductTag: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.UPDATED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
  deletedProductTag: eventBuilderFactory({
    service: Modules.PRODUCT,
    action: CommonEvents.DELETED,
    object: "product_tag",
    eventsEnum: ProductEvents,
  }),
}

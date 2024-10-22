export const CartWorkflowEvents = {
  CREATED: "cart.created",
  UPDATED: "cart.updated",
  CUSTOMER_UPDATED: "cart.customer_updated",
  REGION_UPDATED: "cart.region_updated",
}

export const CustomerWorkflowEvents = {
  CREATED: "customer.created",
  UPDATED: "customer.updated",
  DELETED: "customer.deleted",
}

export const OrderWorkflowEvents = {
  PLACED: "order.placed",
  CANCELED: "order.canceled",
  COMPLETED: "order.completed",
  ARCHIVED: "order.archived",

  FULFILLMENT_CREATED: "order.fulfillment_created",
  FULFILLMENT_CANCELED: "order.fulfillment_canceled",

  RETURN_REQUESTED: "order.return_requested",
  RETURN_RECEIVED: "order.return_received",

  CLAIM_CREATED: "order.claim_created",
  EXCHANGE_CREATED: "order.exchange_created",
}

export const UserWorkflowEvents = {
  CREATED: "user.created",
  UPDATED: "user.updated",
  DELETED: "user.deleted",
}

export const AuthWorkflowEvents = {
  PASSWORD_RESET: "auth.password_reset",
}

export const SalesChannelWorkflowEvents = {
  CREATED: "sales-channel.created",
  UPDATED: "sales-channel.updated",
  DELETED: "sales-channel.deleted",
}

export const ProductCategoryWorkflowEvents = {
  CREATED: "product-category.created",
  UPDATED: "product-category.updated",
  DELETED: "product-category.deleted",
}

export const ProductCollectionWorkflowEvents = {
  CREATED: "product-collection.created",
  UPDATED: "product-collection.updated",
  DELETED: "product-collection.deleted",
}

export const ProductVariantWorkflowEvents = {
  UPDATED: "product-variant.updated",
  CREATED: "product-variant.created",
  DELETED: "product-variant.deleted",
}

export const ProductWorkflowEvents = {
  UPDATED: "product.updated",
  CREATED: "product.created",
  DELETED: "product.deleted",
}

export const ProductTypeWorkflowEvents = {
  UPDATED: "product-type.updated",
  CREATED: "product-type.created",
  DELETED: "product-type.deleted",
}

export const ProductTagWorkflowEvents = {
  UPDATED: "product-tag.updated",
  CREATED: "product-tag.created",
  DELETED: "product-tag.deleted",
}

export const ProductOptionWorkflowEvents = {
  UPDATED: "product-option.updated",
  CREATED: "product-option.created",
  DELETED: "product-option.deleted",
}

export const InviteWorkflowEvents = {
  ACCEPTED: "invite.accepted",
  CREATED: "invite.created",
  DELETED: "invite.deleted",
  RESENT: "invite.resent",
}

export const RegionWorkflowEvents = {
  UPDATED: "region.updated",
  CREATED: "region.created",
  DELETED: "region.deleted",
}

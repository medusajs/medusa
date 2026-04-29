// TODO: Comment temporarely and we will re enable it in the near future #14478
// import { EventOptions } from "@medusajs/types"

/**
 * @category Cart
 * @customNamespace Cart
 */
export const CartWorkflowEvents = {
  /**
   * Emitted when a cart is created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the cart
   * }
   * ```
   */
  CREATED: "cart.created",
  /**
   * Emitted when a cart's details are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the cart
   * }
   * ```
   */
  UPDATED: "cart.updated",
  /**
   * Emitted when the customer in the cart is updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the cart
   * }
   * ```
   */
  CUSTOMER_UPDATED: "cart.customer_updated",
  /**
   * Emitted when the cart's region is updated. This
   * event is emitted alongside the `cart.updated` event.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the cart
   * }
   * ```
   */
  REGION_UPDATED: "cart.region_updated",

  /**
   * Emitted when the customer in the cart is transferred.
   *
   * @since 2.8.0
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the cart
   *   customer_id, // The ID of the customer
   * }
   * ```
   */
  CUSTOMER_TRANSFERRED: "cart.customer_transferred",
} as const

/**
 * @category Customer
 * @customNamespace Customer
 */
export const CustomerWorkflowEvents = {
  /**
   * Emitted when a customer is created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the customer
   * }
   * ```
   */
  CREATED: "customer.created",
  /**
   * Emitted when a customer is updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the customer
   * }
   * ```
   */
  UPDATED: "customer.updated",
  /**
   * Emitted when a customer is deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the customer
   * }
   * ```
   */
  DELETED: "customer.deleted",
} as const

/**
 * @category Order
 * @customNamespace Order
 */
export const OrderWorkflowEvents = {
  /**
   * Emitted when the details of an order or draft order is updated. This
   * doesn't include updates made by an edit.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   * }
   * ```
   */
  UPDATED: "order.updated",

  /**
   * Emitted when an order is placed, or when a draft order is converted to an
   * order.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   * }
   * ```
   */
  PLACED: "order.placed",
  /**
   * Emitted when an order is canceld.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   * }
   * ```
   */
  CANCELED: "order.canceled",
  /**
   * Emitted when orders are completed.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   * }
   * ```
   */
  COMPLETED: "order.completed",
  /**
   * Emitted when an order is archived.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   * }
   * ```
   */
  ARCHIVED: "order.archived",

  /**
   * Emitted when a fulfillment is created for an order.
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   fulfillment_id, // The ID of the fulfillment
   *   no_notification, // (boolean) Whether to notify the customer
   * }
   * ```
   */
  FULFILLMENT_CREATED: "order.fulfillment_created",
  /**
   * Emitted when an order's fulfillment is canceled.
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   fulfillment_id, // The ID of the fulfillment
   *   no_notification, // (boolean) Whether to notify the customer
   * }
   * ```
   */
  FULFILLMENT_CANCELED: "order.fulfillment_canceled",

  /**
   * Emitted when a return request is confirmed.
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   return_id, // The ID of the return
   * }
   * ```
   */
  RETURN_REQUESTED: "order.return_requested",
  /**
   * Emitted when a return is marked as received.
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   return_id, // The ID of the return
   * }
   * ```
   */
  RETURN_RECEIVED: "order.return_received",

  /**
   * Emitted when a claim is created for an order.
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   claim_id, // The ID of the claim
   * }
   * ```
   */
  CLAIM_CREATED: "order.claim_created",
  /**
   * Emitted when an exchange is created for an order.
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   exchange_id, // The ID of the exchange
   * }
   * ```
   */
  EXCHANGE_CREATED: "order.exchange_created",

  /**
   * Emitted when an order is requested to be transferred to
   * another customer.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the order
   *   order_change_id, // The ID of the order change created for the transfer
   * }
   * ```
   */
  TRANSFER_REQUESTED: "order.transfer_requested",
} as const

/**
 * @category Order Edit
 * @customNamespace Order
 */
export const OrderEditWorkflowEvents = {
  /**
   * Emitted when an order edit is requested.
   *
   * @since 2.8.0
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   actions, // (array) The [actions](https://docs.medusajs.com/resources/references/fulfillment/interfaces/fulfillment.OrderChangeActionDTO) to edit the order
   * }
   * ```
   */
  REQUESTED: "order-edit.requested",
  /**
   * Emitted when an order edit request is confirmed.
   *
   * @since 2.8.0
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   actions, // (array) The [actions](https://docs.medusajs.com/resources/references/fulfillment/interfaces/fulfillment.OrderChangeActionDTO) to edit the order
   * }
   * ```
   */
  CONFIRMED: "order-edit.confirmed",
  /**
   * Emitted when an order edit request is canceled.
   *
   * @since 2.8.0
   *
   * @eventPayload
   * ```ts
   * {
   *   order_id, // The ID of the order
   *   actions, // (array) The [actions](https://docs.medusajs.com/resources/references/fulfillment/interfaces/fulfillment.OrderChangeActionDTO) to edit the order
   * }
   * ```
   */
  CANCELED: "order-edit.canceled",
} as const

/**
 * @category User
 * @customNamespace User
 */
export const UserWorkflowEvents = {
  /**
   * Emitted when users are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the user
   * }
   * ```
   */
  CREATED: "user.created",
  /**
   * Emitted when users are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the user
   * }
   * ```
   */
  UPDATED: "user.updated",
  /**
   * Emitted when users are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the user
   * }
   * ```
   */
  DELETED: "user.deleted",
} as const

/**
 * @category Auth
 * @customNamespace Auth
 */
export const AuthWorkflowEvents = {
  /**
   * Emitted when a reset password token is generated. You can listen to this event
   * to send a reset password email to the user or customer, for example.
   *
   * @eventPayload
   * ```ts
   * {
   *   entity_id, // The identifier of the user or customer. For example, an email address.
   *   actor_type, // The type of actor. For example, "customer", "user", or custom.
   *   token, // The generated token.
   *   metadata, // Optional custom metadata passed from the request.
   * }
   * ```
   */
  PASSWORD_RESET: "auth.password_reset",
} as const

/**
 * @category Sales Channel
 * @customNamespace Sales Channel
 */
export const SalesChannelWorkflowEvents = {
  /**
   * Emitted when sales channels are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the sales channel
   * }
   * ```
   */
  CREATED: "sales-channel.created",
  /**
   * Emitted when sales channels are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the sales channel
   * }
   * ```
   */
  UPDATED: "sales-channel.updated",
  /**
   * Emitted when sales channels are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the sales channel
   * }
   * ```
   */
  DELETED: "sales-channel.deleted",
} as const

/**
 * @category Product Category
 * @customNamespace Product
 */
export const ProductCategoryWorkflowEvents = {
  /**
   * Emitted when product categories are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product category
   * }
   * ```
   */
  CREATED: "product-category.created",
  /**
   * Emitted when product categories are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product category
   * }
   * ```
   */
  UPDATED: "product-category.updated",
  /**
   * Emitted when product categories are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product category
   * }
   * ```
   */
  DELETED: "product-category.deleted",
} as const

/**
 * @category Product Collection
 * @customNamespace Product
 */
export const ProductCollectionWorkflowEvents = {
  /**
   * Emitted when product collections are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product collection
   * }
   * ```
   */
  CREATED: "product-collection.created",
  /**
   * Emitted when product collections are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product collection
   * }
   * ```
   */
  UPDATED: "product-collection.updated",
  /**
   * Emitted when product collections are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product collection
   * }
   * ```
   */
  DELETED: "product-collection.deleted",
} as const

/**
 * @category Product Variant
 * @customNamespace Product
 */
export const ProductVariantWorkflowEvents = {
  /**
   * Emitted when product variants are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product variant
   * }
   * ```
   */
  UPDATED: "product-variant.updated",
  /**
   * Emitted when product variants are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product variant
   * }
   * ```
   */
  CREATED: "product-variant.created",
  /**
   * Emitted when product variants are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product variant
   * }
   * ```
   */
  DELETED: "product-variant.deleted",
} as const

/**
 * @category Product
 * @customNamespace Product
 */
export const ProductWorkflowEvents = {
  /**
   * Emitted when products are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product
   * }
   * ```
   */
  UPDATED: "product.updated",
  /**
   * Emitted when products are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product
   * }
   * ```
   */
  CREATED: "product.created",
  /**
   * Emitted when products are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product
   * }
   * ```
   */
  DELETED: "product.deleted",
} as const

/**
 * @category Product Type
 * @customNamespace Product
 */
export const ProductTypeWorkflowEvents = {
  /**
   * Emitted when product types are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product type
   * }
   * ```
   */
  UPDATED: "product-type.updated",
  /**
   * Emitted when product types are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product type
   * }
   * ```
   */
  CREATED: "product-type.created",
  /**
   * Emitted when product types are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product type
   * }
   * ```
   */
  DELETED: "product-type.deleted",
} as const

/**
 * @category Product Tag
 * @customNamespace Product
 */
export const ProductTagWorkflowEvents = {
  /**
   * Emitted when product tags are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product tag
   * }
   * ```
   */
  UPDATED: "product-tag.updated",
  /**
   * Emitted when product tags are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product tag
   * }
   * ```
   */
  CREATED: "product-tag.created",
  /**
   * Emitted when product tags are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product tag
   * }
   * ```
   */
  DELETED: "product-tag.deleted",
} as const

/**
 * @category Product Option
 * @customNamespace Product
 */
export const ProductOptionWorkflowEvents = {
  /**
   * Emitted when product options are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product option
   * }
   * ```
   */
  UPDATED: "product-option.updated",
  /**
   * Emitted when product options are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product option
   * }
   * ```
   */
  CREATED: "product-option.created",
  /**
   * Emitted when product options are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the product option
   * }
   * ```
   */
  DELETED: "product-option.deleted",
} as const

/**
 * @category Invite
 * @customNamespace User
 */
export const InviteWorkflowEvents = {
  /**
   * Emitted when an invite is accepted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the invite
   * }
   * ```
   */
  ACCEPTED: "invite.accepted",
  /**
   * Emitted when invites are created. You can listen to this event
   * to send an email to the invited users, for example.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the invite
   * }
   * ```
   */
  CREATED: "invite.created",
  /**
   * Emitted when invites are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the invite
   * }
   * ```
   */
  DELETED: "invite.deleted",
  /**
   * Emitted when invites should be resent because their token was
   * refreshed. You can listen to this event to send an email to the invited users,
   * for example.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the invite
   * }
   * ```
   */
  RESENT: "invite.resent",
} as const

/**
 * @category Region
 * @customNamespace Region
 */
export const RegionWorkflowEvents = {
  /**
   * Emitted when regions are updated.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the region
   * }
   * ```
   */
  UPDATED: "region.updated",
  /**
   * Emitted when regions are created.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the region
   * }
   * ```
   */
  CREATED: "region.created",
  /**
   * Emitted when regions are deleted.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the region
   * }
   * ```
   */
  DELETED: "region.deleted",
} as const

/**
 * @category Fulfillment
 * @customNamespace Fulfillment
 */
export const FulfillmentWorkflowEvents = {
  /**
   * Emitted when a shipment is created for an order.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // the ID of the fulfillment
   *   no_notification, // (boolean) whether to notify the customer
   * }
   * ```
   */
  SHIPMENT_CREATED: "shipment.created",
  /**
   * Emitted when a fulfillment is marked as delivered.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // the ID of the fulfillment
   * }
   * ```
   */
  DELIVERY_CREATED: "delivery.created",
} as const

/**
 * @category Shipping Option Type
 * @customNamespace Fulfillment
 */
export const ShippingOptionTypeWorkflowEvents = {
  /**
   * Emitted when shipping option types are updated.
   *
   * @since 2.10.0
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the shipping option type
   * }
   * ```
   */
  UPDATED: "shipping-option-type.updated",
  /**
   * Emitted when shipping option types are created.
   *
   * @since 2.10.0
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the shipping option type
   * }
   * ```
   */
  CREATED: "shipping-option-type.created",
  /**
   * Emitted when shipping option types are deleted.
   *
   * @since 2.10.0
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the shipping option type
   * }
   * ```
   */
  DELETED: "shipping-option-type.deleted",
} as const

/**
 * @category Shipping Option
 * @customNamespace Fulfillment
 */
export const ShippingOptionWorkflowEvents = {
  /**
   * Emitted when shipping options are created.
   *
   * @since 2.12.4
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the shipping option
   * }
   * ```
   */
  CREATED: "shipping-option.created",
  /**
   * Emitted when shipping options are updated.
   *
   * @since 2.12.4
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the shipping option
   * }
   * ```
   */
  UPDATED: "shipping-option.updated",
  /**
   * Emitted when shipping options are deleted.
   *
   * @since 2.12.4
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the shipping option
   * }
   * ```
   */
  DELETED: "shipping-option.deleted",
} as const

/**
 * @category Payment
 * @customNamespace Payment
 */
export const PaymentEvents = {
  /**
   * Emitted when a payment is captured.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // the ID of the payment
   * }
   * ```
   */
  CAPTURED: "payment.captured",
  /**
   * Emitted when a payment is refunded.
   *
   * @eventPayload
   * ```ts
   * {
   *   id, // the ID of the payment
   * }
   * ```
   */
  REFUNDED: "payment.refunded",
} as const

/**
 * @category Translation
 * @customNamespace Translation
 */
export const TranslationWorkflowEvents = {
  /**
   * Emitted when translations are created.
   *
   * @since 2.12.3
   * @featureFlag translation
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the translation
   * }
   * ```
   */
  CREATED: "translation.created",
  /**
   * Emitted when translations are updated.
   *
   * @since 2.12.3
   * @featureFlag translation
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the translation
   * }
   * ```
   */
  UPDATED: "translation.updated",
  /**
   * Emitted when translations are deleted.
   *
   * @since 2.12.3
   * @featureFlag translation
   * @eventPayload
   * ```ts
   * {
   *   id, // The ID of the translation
   * }
   * ```
   */
  DELETED: "translation.deleted",
} as const

// TODO: Comment temporarely and we will re enable it in the near future #14478
// declare module "@medusajs/types" {
//   export interface EventBusEventsOptions {
//     // Cart events
//     [CartWorkflowEvents.CREATED]?: EventOptions
//     [CartWorkflowEvents.UPDATED]?: EventOptions
//     [CartWorkflowEvents.CUSTOMER_UPDATED]?: EventOptions
//     [CartWorkflowEvents.REGION_UPDATED]?: EventOptions
//     [CartWorkflowEvents.CUSTOMER_TRANSFERRED]?: EventOptions

//     // Customer events
//     [CustomerWorkflowEvents.CREATED]?: EventOptions
//     [CustomerWorkflowEvents.UPDATED]?: EventOptions
//     [CustomerWorkflowEvents.DELETED]?: EventOptions

//     // Order events
//     [OrderWorkflowEvents.UPDATED]?: EventOptions
//     [OrderWorkflowEvents.PLACED]?: EventOptions
//     [OrderWorkflowEvents.CANCELED]?: EventOptions
//     [OrderWorkflowEvents.COMPLETED]?: EventOptions
//     [OrderWorkflowEvents.ARCHIVED]?: EventOptions
//     [OrderWorkflowEvents.FULFILLMENT_CREATED]?: EventOptions
//     [OrderWorkflowEvents.FULFILLMENT_CANCELED]?: EventOptions
//     [OrderWorkflowEvents.RETURN_REQUESTED]?: EventOptions
//     [OrderWorkflowEvents.RETURN_RECEIVED]?: EventOptions
//     [OrderWorkflowEvents.CLAIM_CREATED]?: EventOptions
//     [OrderWorkflowEvents.EXCHANGE_CREATED]?: EventOptions
//     [OrderWorkflowEvents.TRANSFER_REQUESTED]?: EventOptions

//     // Order Edit events
//     [OrderEditWorkflowEvents.REQUESTED]?: EventOptions
//     [OrderEditWorkflowEvents.CONFIRMED]?: EventOptions
//     [OrderEditWorkflowEvents.CANCELED]?: EventOptions

//     // User events
//     [UserWorkflowEvents.CREATED]?: EventOptions
//     [UserWorkflowEvents.UPDATED]?: EventOptions
//     [UserWorkflowEvents.DELETED]?: EventOptions

//     // Auth events
//     [AuthWorkflowEvents.PASSWORD_RESET]?: EventOptions

//     // Sales Channel events
//     [SalesChannelWorkflowEvents.CREATED]?: EventOptions
//     [SalesChannelWorkflowEvents.UPDATED]?: EventOptions
//     [SalesChannelWorkflowEvents.DELETED]?: EventOptions

//     // Product Category events
//     [ProductCategoryWorkflowEvents.CREATED]?: EventOptions
//     [ProductCategoryWorkflowEvents.UPDATED]?: EventOptions
//     [ProductCategoryWorkflowEvents.DELETED]?: EventOptions

//     // Product Collection events
//     [ProductCollectionWorkflowEvents.CREATED]?: EventOptions
//     [ProductCollectionWorkflowEvents.UPDATED]?: EventOptions
//     [ProductCollectionWorkflowEvents.DELETED]?: EventOptions

//     // Product Variant events
//     [ProductVariantWorkflowEvents.CREATED]?: EventOptions
//     [ProductVariantWorkflowEvents.UPDATED]?: EventOptions
//     [ProductVariantWorkflowEvents.DELETED]?: EventOptions

//     // Product events
//     [ProductWorkflowEvents.CREATED]?: EventOptions
//     [ProductWorkflowEvents.UPDATED]?: EventOptions
//     [ProductWorkflowEvents.DELETED]?: EventOptions

//     // Product Type events
//     [ProductTypeWorkflowEvents.CREATED]?: EventOptions
//     [ProductTypeWorkflowEvents.UPDATED]?: EventOptions
//     [ProductTypeWorkflowEvents.DELETED]?: EventOptions

//     // Product Tag events
//     [ProductTagWorkflowEvents.CREATED]?: EventOptions
//     [ProductTagWorkflowEvents.UPDATED]?: EventOptions
//     [ProductTagWorkflowEvents.DELETED]?: EventOptions

//     // Product Option events
//     [ProductOptionWorkflowEvents.CREATED]?: EventOptions
//     [ProductOptionWorkflowEvents.UPDATED]?: EventOptions
//     [ProductOptionWorkflowEvents.DELETED]?: EventOptions

//     // Invite events
//     [InviteWorkflowEvents.ACCEPTED]?: EventOptions
//     [InviteWorkflowEvents.CREATED]?: EventOptions
//     [InviteWorkflowEvents.DELETED]?: EventOptions
//     [InviteWorkflowEvents.RESENT]?: EventOptions

//     // Region events
//     [RegionWorkflowEvents.CREATED]?: EventOptions
//     [RegionWorkflowEvents.UPDATED]?: EventOptions
//     [RegionWorkflowEvents.DELETED]?: EventOptions

//     // Fulfillment events
//     [FulfillmentWorkflowEvents.SHIPMENT_CREATED]?: EventOptions
//     [FulfillmentWorkflowEvents.DELIVERY_CREATED]?: EventOptions

//     // Shipping Option Type events
//     [ShippingOptionTypeWorkflowEvents.CREATED]?: EventOptions
//     [ShippingOptionTypeWorkflowEvents.UPDATED]?: EventOptions
//     [ShippingOptionTypeWorkflowEvents.DELETED]?: EventOptions

//     // Shipping Option events
//     [ShippingOptionWorkflowEvents.CREATED]?: EventOptions
//     [ShippingOptionWorkflowEvents.UPDATED]?: EventOptions
//     [ShippingOptionWorkflowEvents.DELETED]?: EventOptions

//     // Payment events
//     [PaymentEvents.CAPTURED]?: EventOptions
//     [PaymentEvents.REFUNDED]?: EventOptions

//     // Translation events
//     [TranslationWorkflowEvents.CREATED]?: EventOptions
//     [TranslationWorkflowEvents.UPDATED]?: EventOptions
//     [TranslationWorkflowEvents.DELETED]?: EventOptions
//   }
// }

export { default as AuthService } from "./auth"
export { default as CartService } from "./cart"
export { default as ClaimService } from "./claim"
export { default as ClaimItemService } from "./claim-item"
export { default as CustomShippingOptionService } from "./custom-shipping-option"
export { default as CustomerService } from "./customer"
export { default as DiscountService } from "./discount"
export { default as DraftOrderService } from "./draft-order"
export { default as EventBusService } from "./event-bus"
export { default as FulfillmentService } from "./fulfillment"
export { default as FulfillmentProviderService } from "./fulfillment-provider"
export { default as GiftCardService } from "./gift-card"
export { default as IdempotencyKeyService } from "./idempotency-key"
export { default as InventoryService } from "./inventory"
export { default as LineItemService } from "./line-item"
export { default as MiddlewareService } from "./middleware"
export { default as NoteService } from "./note"
export { default as NotificationService } from "./notification"
export { default as OauthService } from "./oauth"
export { default as OrderService } from "./order"
export { default as PaymentProviderService } from "./payment-provider"
export { default as ProductService } from "./product"
export { default as ProductCollectionService } from "./product-collection"
export { default as ProductVariantService } from "./product-variant"
export { default as QueryBuilderService } from "./query-builder"
export { default as RegionService } from "./region"
export { default as ReturnService } from "./return"
export { default as ReturnReasonService } from "./return-reason"
export { default as SearchService } from "./search"
export { default as ShippingOptionService } from "./shipping-option"
export { default as ShippingProfileService } from "./shipping-profile"
export { default as StoreService } from "./store"
export { default as SwapService } from "./swap"
export { default as SystemPaymentProviderService } from "./system-payment-provider"
export { default as TotalsService } from "./totals"
export { default as TransactionService } from "./transaction"
export { default as UserService } from "./user"

export const ServiceIdentifiers = {
  authService: "authService",
  cartService: "cartService",
  claimService: "claimService",
  claimItemService: "claimItemService",
  customShippingOptionService: "customShippingOptionService",
  customerService: "customerService",
  discountService: "discountService",
  draftOrderService: "draftOrderService",
  eventBusService: "eventBusService",
  fulfillmentService: "fulfillmentService",
  fulfillmentProviderService: "fulfillmentProviderService",
  giftCardService: "giftCardService",
  idempotencyKeyService: "idempotencyKeyService",
  inventoryService: "inventoryService",
  lineItemService: "lineItemService",
  middlewareService: "middlewareService",
  noteService: "noteService",
  notificationService: "notificationService",
  oauthService: "oauthService",
  orderService: "orderService",
  paymentProviderService: "paymentProviderService",
  productService: "productService",
  productCollectionService: "productCollectionService",
  productVariantService: "productVariantService",
  queryBuilderService: "queryBuilderService",
  regionService: "regionService",
  returnService: "returnService",
  returnReasonService: "returnReasonService",
  searchService: "searchService",
  shippingOptionService: "shippingOptionService",
  shippingProfileService: "shippingProfileService",
  storeService: "storeService",
  swapService: "swapService",
  systemPaymentProviderService: "systemPaymentProviderService",
  totalsService: "totalsService",
  transactionService: "transactionService",
  userService: "userService",
}

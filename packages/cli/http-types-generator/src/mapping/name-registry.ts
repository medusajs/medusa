/**
 * Static map of Zod validator export names → HTTP type interface names,
 * for cases where the naming convention differs between the two.
 *
 * Most schemas follow the same name (AdminCreateProduct → AdminCreateProduct),
 * but query/filter schemas often differ (AdminGetProductsParams → AdminProductListParams).
 *
 * When adding new validator schemas, prefer adding a `@http-type-name` JSDoc
 * tag in the validator file instead of adding to this registry. This registry
 * is only meant to remain backward-compatible with existing schemas that predate this tool.
 * 
 * Value can be `skip` to indicate that this export should be ignored by the generator 
 * (e.g. if it's a single-item select params that shares a name with the list params, 
 * or if it's an embedded schema used within another payload).
 *
 * @example
 * ```typescript
 * // packages/medusa/src/api/admin/products/validators.ts
 * /** @http-type-name AdminProductListParams *\/
 * export const AdminGetProductsParams = createFindParams(...)
 * ```
 */
export const VALIDATOR_TO_HTTP_TYPE_NAME: Record<string, string> = {
  // ----------- customers -----------
  AdminCustomersParams: "AdminCustomerFilters",
  AdminCustomerAddressesParams: "AdminCustomerAddressFilters",

  // ----------- products -----------
  AdminGetProductsParams: "skip",
  AdminGetProductOptionsParams: "AdminProductOptionParams",
  AdminGetProductVariantsParams: "AdminProductVariantParams",
  // Singular GET params (createSelectParams) for single-item fetches; skip them.
  // The list params are validated via AdminGetProductVariantsParams and AdminGetProductOptionsParams.
  AdminGetProductVariantParams: "skip",
  AdminGetProductOptionParams: "skip",
  // Payload schemas with different HTTP type names
  AdminCreateVariantPrice: "AdminCreateProductVariantPrice",
  AdminBatchImageVariant: "AdminBatchImageVariantRequest",
  AdminBatchVariantImages: "AdminBatchVariantImagesRequest",
  AdminImportProducts: "AdminImportProductsRequest",
  StoreProductVariantListParams: "StoreProductVariantParams",

  // ----------- orders -----------
  AdminGetOrdersParams: "AdminOrderFilters",
  AdminGetOrdersOrderParams: "AdminGetOrderParams",
  AdminGetOrdersOrderItemsParams: "AdminOrderItemsFilters",
  AdminOrderChangesParams: "AdminOrderChangesFilters",
  // Order action payloads with different HTTP type names
  AdminOrderCreateFulfillment: "AdminCreateOrderFulfillment",
  AdminOrderCreateShipment: "AdminCreateOrderShipment",
  AdminOrderCancelFulfillment: "AdminCancelOrderFulfillment",
  AdminTransferOrder: "AdminRequestOrderTransfer",
  AdminCreateOrderCreditLines: "AdminCreateOrderCreditLine",

  // ----------- returns -----------
  // AdminGetReturnParams is a single-item select params; the return list params
  // are validated via the return domain-scoped override (AdminGetOrdersParams).
  AdminGetReturnParams: "skip",

  // ----------- return-reasons -----------
  AdminGetReturnReasonsReturnReasonParams: "AdminReturnReasonParams",
  AdminGetReturnReasonsParams: "AdminReturnReasonListParams",

  // ----------- refund-reasons -----------
  AdminCreatePaymentRefundReason: "AdminCreateRefundReason",
  AdminUpdatePaymentRefundReason: "AdminUpdateRefundReason",
  AdminGetRefundReasonsParams: "AdminRefundReasonListParams",
  AdminGetRefundReasonParams: "AdminRefundReasonParams",

  // ----------- carts -----------
  StoreGetCartParams: "StoreCartParams",

  // ----------- regions -----------
  AdminGetRegionsParams: "AdminRegionFilters",

  // ----------- shipping options -----------
  AdminGetShippingOptionsParams: "AdminShippingOptionListParams",
  AdminGetShippingOptionTypesParams: "AdminShippingOptionTypeListParams",
  AdminCreateShippingOptionTypeObject: "AdminCreateShippingOptionType",

  // ----------- shipping-profiles -----------
  AdminGetShippingProfilesParams: "AdminShippingProfileListParams",

  // ----------- collections -----------
  AdminGetCollectionsParams: "AdminCollectionListParams",
  StoreGetCollectionsParams: "StoreCollectionListParams",
  StoreGetCollectionParams: "StoreCollectionParams",

  // ----------- currencies -----------
  AdminGetCurrenciesParams: "AdminCurrencyListParams",
  StoreGetCurrenciesParams: "StoreGetCurrencyListParams",

  // ----------- locales -----------
  AdminGetLocalesParams: "AdminLocaleListParams",

  // ----------- notifications -----------
  AdminGetNotificationsParams: "AdminNotificationListParams",

  // ----------- payments -----------
  AdminGetPaymentsParams: "AdminPaymentFilters",

  // ----------- product-categories -----------
  AdminProductCategoriesParams: "AdminProductCategoryListParams",
  StoreProductCategoriesParams: "StoreProductCategoryListParams",

  // ----------- product-tags -----------
  AdminGetProductTagsParams: "AdminProductTagListParams",
  StoreProductTagsParams: "StoreProductTagListParams",

  // ----------- product-types -----------
  AdminGetProductTypesParams: "AdminProductTypeListParams",
  StoreProductTypesParams: "StoreProductTypeListParams",

  // ----------- product-variants -----------
  // StoreProductVariantParams (from store/product-variants) is a single-item
  // select params with context fields; the list params are validated via
  // StoreGetProductVariantsParams above.
  StoreProductVariantParams: "skip",

  // ----------- price-preferences -----------
  AdminGetPricePreferencesParams: "AdminPricePreferenceListParams",

  // ----------- products -----------
  StoreGetProductsParams: "skip",

  // ----------- regions -----------
  StoreGetRegionsParams: "StoreRegionFilters",

  // ----------- shipping-options -----------
  StoreGetShippingOptions: "StoreGetShippingOptionList",

  // ----------- orders -----------
  StoreGetOrdersParams: "StoreOrderFilters",

  // ----------- customers (store) -----------
  StoreGetCustomerAddressesParams: "StoreCustomerAddressFilters",

  // ----------- price lists -----------
  AdminGetPriceListsParams: "AdminPriceListListParams",
  AdminGetPriceListParams: "AdminPriceListParams",
  AdminGetPriceListPricesParams: "AdminPriceListPriceListParams",
  AdminRemoveProductsPriceList: "AdminLinkPriceListProducts",

  // ----------- inventory items -----------
  AdminGetInventoryItemsParams: "AdminInventoryItemsParams",

  // ----------- sales-channels -----------
  AdminGetSalesChannelsParams: "skip",

  // ----------- stock-locations -----------
  AdminGetStockLocationsParams: "skip",

  // ----------- reservations -----------
  AdminGetReservationParams: "AdminReservationParams",

  // ----------- stores -----------
  AdminGetStoreParams: "AdminStoreParams",
  AdminGetStoresParams: "AdminStoreListParams",

  // ----------- tax-rates -----------
  AdminGetTaxRatesParams: "AdminTaxRateListParams",

  // ----------- tax-regions -----------
  AdminGetTaxRegionParams: "AdminTaxRegionParams",
  AdminGetTaxRegionsParams: "AdminTaxRegionListParams",

  // ----------- users -----------
  AdminGetUserParams: "AdminUserParams",
  AdminGetUsersParams: "AdminUserListParams",

  // ----------- file/uploads -----------
  AdminUploadPreSignedUrl: "AdminUploadPreSignedUrlRequest",

  // ----------- translations -----------
  AdminGetTranslationsParams: "AdminTranslationsListParams",
  AdminTranslationStatistics: "AdminTranslationStatisticsParams",

  // ----------- draft-orders -----------
  AdminGetDraftOrdersParams: "AdminDraftOrderListParams",
  AdminGetDraftOrderParams: "AdminDraftOrderParams",

  // ----------- exchanges -----------
  // AdminGetExchangeParams is a single-item select params; exchange list params
  // are validated via the exchange domain-scoped override (AdminGetOrdersParams).
  AdminGetExchangeParams: "skip",

  // ----------- fulfillment-providers -----------
  AdminFulfillmentProvidersParams: "AdminGetFulfillmentProvidersParams",

  // ----------- fulfillment-sets -----------
  // AdminFulfillmentSetParams is a single-item select params; there is no list
  // validator for fulfillment sets, so skip this mapping.
  AdminFulfillmentSetParams: "skip",

  // ----------- inventory-levels -----------
  AdminGetInventoryLocationLevelsParams: "AdminInventoryLevelFilters",

  // ----------- locales -----------
  AdminGetLocaleParams: "AdminLocaleParams",

  // ----------- payment-providers (store) -----------
  StoreGetPaymentProvidersParams: "StorePaymentProviderFilters",

  // ----------- currencies (admin) -----------
  AdminGetCurrencyParams: "AdminCurrencyParams",

  // ----------- products (store) -----------
  StoreGetProductParams: "StoreProductParams",

  // ----------- collections (single-item GET params) -----------
  AdminGetCollectionParams: "AdminCollectionParams",

  // ----------- notifications (single-item GET params) -----------
  AdminGetNotificationParams: "AdminNotificationParams",

  // ----------- product-tags (single-item GET params) -----------
  AdminGetProductTagParams: "AdminProductTagParams",

  // ----------- product-types (single-item GET params) -----------
  AdminGetProductTypeParams: "AdminProductTypeParams",

  // ----------- payment payloads with different HTTP type names -----------
  AdminCreatePaymentCapture: "AdminCapturePayment",
  AdminCreatePaymentRefund: "AdminRefundPayment",
  AdminMarkPaymentCollectionPaid: "AdminMarkPaymentCollectionAsPaid",

  // ----------- fulfillment payloads -----------
  AdminCreateShipment: "AdminCreateFulfillmentShipment",

  // ----------- invite payloads -----------
  AdminInviteAccept: "AdminAcceptInvite",

  // ----------- inventory level payloads -----------
  AdminUpdateInventoryLocationLevel: "AdminUpdateInventoryLevel",
  AdminCreateInventoryLocationLevel: "AdminBatchCreateInventoryItemLocationLevels",
  AdminUpdateInventoryLocationLevelBatch: "AdminBatchUpdateInventoryItemLocationLevels",
  AdminBatchInventoryItemLocationsLevel: "AdminBatchInventoryItemLocationLevels",
  AdminBatchInventoryItemLevels: "AdminBatchInventoryItemsLocationLevels",

  // ----------- cart (store) payloads -----------
  StoreAddCartPromotions: "StoreCartAddPromotion",
  StoreRemoveCartPromotions: "StoreCartRemovePromotion",

  // ----------- order (store) payloads -----------
  StoreDeclineOrderTransferRequest: "StoreDeclineOrderTransfer",

  // ----------- payment (store) queries -----------
  // StoreGetPaymentCollectionParams is a single-item select params; skip it.
  StoreGetPaymentCollectionParams: "skip",

  // ----------- payment-session (store) payloads -----------
  StoreCreatePaymentSession: "StoreInitializePaymentSession",

  // ----------- shipping-options (store) -----------
  // StoreGetShippingOptionsParams is a single-item select params; skip it.
  // The list params are validated via StoreGetShippingOptions above.
  StoreGetShippingOptionsParams: "skip",
}

/**
 * Domain-scoped name overrides: used when the same Zod export name appears
 * in multiple validator files with different schemas. This is only
 * meant to remain backward-compatible with existing schemas that predate this tool.
 *
 * Key format: routeDirName (as it appears in the API path, e.g. "exchanges")
 * Value: map of Zod export name → HTTP type name (or "skip" to skip entirely)
 */
export const DOMAIN_SCOPED_OVERRIDES: Record<string, Record<string, string>> = {
  // The exchange, claim, and return validator files re-export AdminGetOrdersOrderParams
  // and AdminGetOrdersParams with domain-specific filter fields. These must be mapped
  // to the correct domain HTTP types, not the global order types.
  // Note: domain keys here are the MAPPED names from path-mapper (singular/normalized).
  exchange: {
    AdminGetOrdersOrderParams: "AdminOrderExchangeListParams",
    AdminGetOrdersParams: "AdminExchangeListParams",
  },
  claim: {
    AdminGetOrdersOrderParams: "AdminClaimParams",
    AdminGetOrdersParams: "AdminClaimListParams",
  },
  return: {
    // No matching single-select HTTP type for returns; skip it.
    AdminGetOrdersOrderParams: "skip",
    // Returns list uses AdminReturnFilters (already in global registry, but
    // listing here explicitly to document the domain context).
    AdminGetOrdersParams: "AdminReturnFilters",
  },
  // The products validator file defines simplified versions of AdminCreateProductTag,
  // AdminUpdateProductTag, and AdminCreateProductType (without metadata) for
  // embedded use within product creation. These types are validated separately
  // from their domain-specific validator files (product-tags, product-types).
  product: {
    AdminCreateProductTag: "skip",
    AdminUpdateProductTag: "skip",
    AdminCreateProductType: "skip",
  },
  // The payments validator file defines a simplified inline version of
  // AdminCreatePaymentRefundReason (label + description only, no code) for
  // inline refund reason creation during payment refunds. The standalone refund
  // reason type is validated separately from the refund-reasons domain.
  payment: {
    AdminCreatePaymentRefundReason: "skip",
  },
}

/**
 * Reverse lookup: HTTP type name → validator export name.
 * Used by the validate command to find the Zod schema for a given HTTP type.
 */
export const HTTP_TYPE_TO_VALIDATOR_NAME: Record<string, string> =
  Object.fromEntries(
    Object.entries(VALIDATOR_TO_HTTP_TYPE_NAME).filter(([_, v]) => v !== "skip").map(([k, v]) => [v, k])
  )

/**
 * Resolves HTTP type names for validator export names and vice versa.
 */
export class NameRegistry {
  /**
   * Resolves the HTTP type name for a given validator export name.
   * Falls back to the export name itself if no override is registered.
   *
   * @param exportName - The Zod validator export name.
   * @param domain - Optional route directory name (e.g. "exchanges", "claims").
   *   When provided, domain-scoped overrides take precedence over global mappings.
   *   Returns "skip" if the export should be excluded from validation in this domain.
   */
  static resolveHttpTypeName(exportName: string, domain?: string): string {
    if (domain) {
      const domainOverride = DOMAIN_SCOPED_OVERRIDES[domain]?.[exportName]
      if (domainOverride !== undefined) {
        return domainOverride
      }
    }
    return VALIDATOR_TO_HTTP_TYPE_NAME[exportName] ?? exportName
  }

  /**
   * Resolves the validator export name for a given HTTP type name.
   * Falls back to the HTTP type name itself if no mapping is registered.
   */
  static resolveValidatorName(httpTypeName: string): string {
    return HTTP_TYPE_TO_VALIDATOR_NAME[httpTypeName] ?? httpTypeName
  }
}

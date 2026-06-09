import { useMemo } from "react"
import type { PermissionResource } from "../lib/permissions"
import { usePermissions } from "../providers/permissions-provider"

/**
 * Hook that provides convenient permission checks for a specific resource.
 * Returns boolean flags for common CRUD operations.
 *
 * @param resource - The resource to check permissions for
 * @returns Object with permission flags and utility methods
 *
 * @example
 * ```tsx
 * const { canRead, canCreate, canUpdate, canDelete } = useResourcePermissions("customer")
 *
 * return (
 *   <div>
 *     {canRead && <CustomerList />}
 *     {canCreate && <Button>Create Customer</Button>}
 *   </div>
 * )
 * ```
 */
export const useResourcePermissions = (resource: PermissionResource) => {
  const { can, isLoading } = usePermissions()

  return useMemo(
    () => ({
      /**
       * Whether the user can view/list this resource.
       */
      canRead: can(resource, "read"),

      /**
       * Whether the user can create new instances of this resource.
       */
      canCreate: can(resource, "create"),

      /**
       * Whether the user can update existing instances of this resource.
       */
      canUpdate: can(resource, "update"),

      /**
       * Whether the user can delete instances of this resource.
       */
      canDelete: can(resource, "delete"),

      /**
       * Check a specific operation on this resource.
       */
      can: (operation: "read" | "create" | "update" | "delete") =>
        can(resource, operation),

      /**
       * The resource being checked.
       */
      resource,

      /**
       * Whether permissions are still loading.
       */
      isLoading,
    }),
    [can, resource, isLoading]
  )
}

/**
 * Hook for checking customer-specific permissions.
 */
export const useCustomerPermissions = () => useResourcePermissions("customer")

export const useSalesChannelPermissions = () =>
  useResourcePermissions("sales_channel")

/**
 * Hook for checking customer address-specific permissions.
 */
export const useCustomerAddressPermissions = () =>
  useResourcePermissions("customer_address")

/**
 * Hook for checking order-specific permissions.
 */
export const useOrderPermissions = () => useResourcePermissions("order")

export const useFulfillmentPermissions = () =>
  useResourcePermissions("fulfillment")

export const useStockLocationPermissions = () =>
  useResourcePermissions("stock_location")

export const useShippingOptionPermissions = () =>
  useResourcePermissions("shipping_option")

export const useShippingOptionTypePermissions = () =>
  useResourcePermissions("shipping_option_type")

export const useServiceZonePermissions = () =>
  useResourcePermissions("service_zone")

export const useFulfillmentSetPermissions = () =>
  useResourcePermissions("fulfillment_set")

export const useFulfillmentProviderPermissions = () =>
  useResourcePermissions("fulfillment_provider")

export const useStorePermissions = () => useResourcePermissions("store")

export const useCurrencyPermissions = () => useResourcePermissions("currency")

export const useShippingProfilePermissions = () =>
  useResourcePermissions("shipping_profile")

export const useReturnPermissions = () => useResourcePermissions("return")

export const useOrderClaimPermissions = () =>
  useResourcePermissions("order_claim")

export const useOrderAddressPermissions = () =>
  useResourcePermissions("order_address")

export const useOrderExchangePermissions = () =>
  useResourcePermissions("order_exchange")

export const useOrderChangePermissions = () =>
  useResourcePermissions("order_change")

export const useCapturePermissions = () => useResourcePermissions("capture")

export const useRefundPermissions = () => useResourcePermissions("refund")

export const usePaymentCollectionPermissions = () =>
  useResourcePermissions("payment_collection")

export const usePaymentPermissions = () => useResourcePermissions("payment")

export const useReservationItemPermissions = () =>
  useResourcePermissions("reservation_item")

/**
 * Hook for checking customer group-specific permissions.
 */
export const useCustomerGroupPermissions = () =>
  useResourcePermissions("customer_group")

/**
 * Hook for checking product-specific permissions.
 */
export const useProductPermissions = () => useResourcePermissions("product")

/**
 * Hook for checking inventory-specific permissions.
 */
export const useInventoryPermissions = () => useResourcePermissions("inventory")

export const useInventoryItemPermissions = () =>
  useResourcePermissions("inventory_item")

export const useInventoryLevelPermissions = () =>
  useResourcePermissions("inventory_level")

/**
 * Hook for checking user management permissions.
 */
export const useUserPermissions = () => useResourcePermissions("user")

/**
 * Hook for checking invite-specific permissions.
 */
export const useInvitePermissions = () => useResourcePermissions("invite")

/**
 * Hook for checking API key-specific permissions.
 */
export const useApiKeyPermissions = () => useResourcePermissions("api_key")

/**
 * Hook for checking promotion-specific permissions.
 */
export const usePromotionPermissions = () => useResourcePermissions("promotion")

/**
 * Hook for checking campaign-specific permissions.
 */
export const useCampaignPermissions = () => useResourcePermissions("campaign")

/**
 * Hook for checking price list-specific permissions.
 */
export const usePriceListPermissions = () =>
  useResourcePermissions("price_list")

export const usePricePreferencePermissions = () =>
  useResourcePermissions("price_preference")

export const usePricePermissions = () => useResourcePermissions("price")

/**
 * Hook for checking region-specific permissions.
 */
export const useRegionPermissions = () => useResourcePermissions("region")

/**
 * Hook for checking return reason-specific permissions.
 */
export const useReturnReasonPermissions = () =>
  useResourcePermissions("return_reason")

/**
 * Hook for checking refund reason-specific permissions.
 */
export const useRefundReasonPermissions = () =>
  useResourcePermissions("refund_reason")

/**
 * Hook for checking tax region-specific permissions. Provinces, tax rates, and
 * tax overrides are all part of the `tax_region` resource.
 */
export const useTaxRegionPermissions = () =>
  useResourcePermissions("tax_region")

export const useTaxRatePermissions = () => useResourcePermissions("tax_rate")

/**
 * Hook for checking workflow execution-specific permissions.
 */
export const useWorkflowExecutionPermissions = () =>
  useResourcePermissions("workflow_execution")

/**
 * Hook for checking translation-specific permissions.
 */
export const useTranslationPermissions = () =>
  useResourcePermissions("translation")

/**
 * Hook for checking translation setting-specific permissions.
 */
export const useTranslationSettingPermissions = () =>
  useResourcePermissions("translation_setting")

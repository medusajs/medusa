import BaseResource from "../base"
import AdminAuthResource from "./auth"
import AdminBatchJobsResource from "./batch-jobs"
import AdminCollectionsResource from "./collections"
import AdminCurrenciesResource from "./currencies"
import AdminCustomResource from "./custom"
import AdminCustomerGroupsResource from "./customer-groups"
import AdminCustomersResource from "./customers"
import AdminDiscountsResource from "./discounts"
import AdminDraftOrdersResource from "./draft-orders"
import AdminGiftCardsResource from "./gift-cards"
import AdminInventoryItemsResource from "./inventory-item"
import AdminInvitesResource from "./invites"
import AdminNotesResource from "./notes"
import AdminNotificationsResource from "./notifications"
import AdminOrderEditsResource from "./order-edits"
import AdminOrdersResource from "./orders"
import AdminPaymentCollectionsResource from "./payment-collections"
import AdminPaymentsResource from "./payments"
import AdminPriceListResource from "./price-lists"
import AdminProductCategoriesResource from "./product-categories"
import AdminProductTagsResource from "./product-tags"
import AdminProductTypesResource from "./product-types"
import AdminProductsResource from "./products"
import AdminPublishableApiKeyResource from "./publishable-api-keys"
import AdminRegionsResource from "./regions"
import AdminReservationsResource from "./reservations"
import AdminReturnReasonsResource from "./return-reasons"
import AdminReturnsResource from "./returns"
import AdminSalesChannelsResource from "./sales-channels"
import AdminShippingOptionsResource from "./shipping-options"
import AdminShippingProfilesResource from "./shipping-profiles"
import AdminStockLocationsResource from "./stock-locations"
import AdminStoresResource from "./store"
import AdminSwapsResource from "./swaps"
import AdminTaxRatesResource from "./tax-rates"
import AdminUploadsResource from "./uploads"
import AdminUsersResource from "./users"
import AdminVariantsResource from "./variants"

/**
 * This class includes properties used to send requests to the [Admin API Routes](https://docs.medusajs.com/api/admin). All its properties
 * are available in the JS Client under the `medusa.admin` property.
 */
class Admin extends BaseResource {
  /**
   * An instance of {@link AdminAuthResource} used to send requests to [Admin Auth API Routes](https://docs.medusajs.com/api/admin#auth).
   */
  public auth = new AdminAuthResource(this.client)
  /**
   * An instance of {@link AdminBatchJobsResource} used to send requests to [Admin Batch Job API Routes](https://docs.medusajs.com/api/admin#batch-jobs).
   */
  public batchJobs = new AdminBatchJobsResource(this.client)
  /**
   * An instance of {@link AdminCustomersResource} used to send requests to [Admin Customer API Routes](https://docs.medusajs.com/api/admin#customers).
   */
  public customers = new AdminCustomersResource(this.client)
  /**
   * An instance of {@link AdminCustomerGroupsResource} used to send requests to [Admin Customer Group API Routes](https://docs.medusajs.com/api/admin#customer-groups).
   */
  public customerGroups = new AdminCustomerGroupsResource(this.client)
  /**
   * An instance of {@link AdminDiscountsResource} used to send requests to [Admin Discount API Routes](https://docs.medusajs.com/api/admin#discounts).
   */
  public discounts = new AdminDiscountsResource(this.client)
  /**
   * An instance of {@link AdminCurrenciesResource} used to send requests to [Admin Currency API Routes](https://docs.medusajs.com/api/admin#currencies_getcurrencies).
   */
  public currencies = new AdminCurrenciesResource(this.client)
  /**
   * An instance of {@link AdminCollectionsResource} used to send requests to [Admin Product Collection API Routes](https://docs.medusajs.com/api/admin#product-collections).
   */
  public collections = new AdminCollectionsResource(this.client)
  /**
   * An instance of {@link AdminDraftOrdersResource} used to send requests to [Admin Draft Order API Routes](https://docs.medusajs.com/api/admin#draft-orders).
   */
  public draftOrders = new AdminDraftOrdersResource(this.client)
  /**
   * An instance of {@link AdminGiftCardsResource} used to send requests to [Admin Gift Card API Routes](https://docs.medusajs.com/api/admin#gift-cards).
   */
  public giftCards = new AdminGiftCardsResource(this.client)
  /**
   * An instance of {@link AdminInvitesResource} used to send requests to [Admin Invite API Routes](https://docs.medusajs.com/api/admin#invites).
   */
  public invites = new AdminInvitesResource(this.client)
  /**
   * An instance of {@link AdminInventoryItemsResource} used to send requests to [Admin Inventory Item API Routes](https://docs.medusajs.com/api/admin#inventory-items).
   */
  public inventoryItems = new AdminInventoryItemsResource(this.client)
  /**
   * An instance of {@link AdminNotesResource} used to send requests to [Admin Note API Routes](https://docs.medusajs.com/api/admin#notes).
   */
  public notes = new AdminNotesResource(this.client)
  /**
   * An instance of {@link AdminPriceListResource} used to send requests to [Admin Price List API Routes](https://docs.medusajs.com/api/admin#price-lists).
   */
  public priceLists = new AdminPriceListResource(this.client)
  /**
   * An instance of {@link AdminProductsResource} used to send requests to [Admin Product API Routes](https://docs.medusajs.com/api/admin#products).
   */
  public products = new AdminProductsResource(this.client)
  /**
   * An instance of {@link AdminProductTagsResource} used to send requests to [Admin Product Tag API Routes](https://docs.medusajs.com/api/admin#product-tags).
   */
  public productTags = new AdminProductTagsResource(this.client)
  /**
   * An instance of {@link AdminProductTypesResource} used to send requests to [Admin Product Type API Routes](https://docs.medusajs.com/api/admin#product-types).
   */
  public productTypes = new AdminProductTypesResource(this.client)
  /**
   * An instance of {@link AdminUsersResource} used to send requests to [Admin User API Routes](https://docs.medusajs.com/api/admin#users).
   */
  public users = new AdminUsersResource(this.client)
  /**
   * An instance of {@link AdminReturnsResource} used to send requests to [Admin Return API Routes](https://docs.medusajs.com/api/admin#returns).
   */
  public returns = new AdminReturnsResource(this.client)
  /**
   * An instance of {@link AdminOrdersResource} used to send requests to [Admin Order API Routes](https://docs.medusajs.com/api/admin#orders).
   */
  public orders = new AdminOrdersResource(this.client)
  /**
   * An instance of {@link AdminOrderEditsResource} used to send requests to [Admin Order Edit API Routes](https://docs.medusajs.com/api/admin#order-edits).
   */
  public orderEdits = new AdminOrderEditsResource(this.client)
  /**
   * An instance of {@link AdminPublishableApiKeyResource} used to send requests to [Admin Publishable API Key API Routes](https://docs.medusajs.com/api/admin#publishable-api-keys).
   */
  public publishableApiKeys = new AdminPublishableApiKeyResource(this.client)
  /**
   * An instance of {@link AdminReturnReasonsResource} used to send requests to [Admin Return Reason API Routes](https://docs.medusajs.com/api/admin#return-reasons).
   */
  public returnReasons = new AdminReturnReasonsResource(this.client)
  /**
   * @props variants - An instance of {@link AdminVariantsResource} used to send requests to [Admin Product Variant API Routes](https://docs.medusajs.com/api/admin#product-variants).
   */
  public variants = new AdminVariantsResource(this.client)
  /**
   * An instance of {@link AdminSalesChannelsResource} used to send requests to [Admin Sales Channel API Routes](https://docs.medusajs.com/api/admin#sales-channels).
   */
  public salesChannels = new AdminSalesChannelsResource(this.client)
  /**
   * An instance of {@link AdminSwapsResource} used to send requests to [Admin Swap API Routes](https://docs.medusajs.com/api/admin#swaps).
   */
  public swaps = new AdminSwapsResource(this.client)
  /**
   * An instance of {@link AdminShippingProfilesResource} used to send requests to [Admin Shipping Profile API Routes](https://docs.medusajs.com/api/admin#shipping-profiles).
   */
  public shippingProfiles = new AdminShippingProfilesResource(this.client)
  /**
   * An instance of {@link AdminStockLocationsResource} used to send requests to [Admin Stock Location API Routes](https://docs.medusajs.com/api/admin#stock-locations).
   */
  public stockLocations = new AdminStockLocationsResource(this.client)
  /**
   * An instance of {@link AdminStoresResource} used to send requests to [Admin Store API Routes](https://docs.medusajs.com/api/admin#store).
   */
  public store = new AdminStoresResource(this.client)
  /**
   * An instance of {@link AdminShippingOptionsResource} used to send requests to [Admin Shipping Option API Routes](https://docs.medusajs.com/api/admin#shipping-options).
   */
  public shippingOptions = new AdminShippingOptionsResource(this.client)
  /**
   * An instance of {@link AdminRegionsResource} used to send requests to [Admin Region API Routes](https://docs.medusajs.com/api/admin#regions).
   */
  public regions = new AdminRegionsResource(this.client)
  /**
   * An instance of {@link AdminReservationsResource} used to send requests to [Admin Reservation API Routes](https://docs.medusajs.com/api/admin#reservations).
   */
  public reservations = new AdminReservationsResource(this.client)
  /**
   * An instance of {@link AdminNotificationsResource} used to send requests to [Admin Notification API Routes](https://docs.medusajs.com/api/admin#notifications).
   */
  public notifications = new AdminNotificationsResource(this.client)
  /**
   * An instance of {@link AdminTaxRatesResource} used to send requests to [Admin Tax Rate API Routes](https://docs.medusajs.com/api/admin#tax-rates).
   */
  public taxRates = new AdminTaxRatesResource(this.client)
  /**
   * An instance of {@link AdminUploadsResource} used to send requests to [Admin Upload API Routes](https://docs.medusajs.com/api/admin#uploads).
   */
  public uploads = new AdminUploadsResource(this.client)
  /**
   * An instance of {@link AdminPaymentCollectionsResource} used to send requests to [Admin Payment Collection API Routes](https://docs.medusajs.com/api/admin#payment-collections).
   */
  public paymentCollections = new AdminPaymentCollectionsResource(this.client)
  /**
   * An instance of {@link AdminPaymentsResource} used to send requests to [Admin Payment API Routes](https://docs.medusajs.com/api/admin#payments).
   */
  public payments = new AdminPaymentsResource(this.client)
  /**
   * An instance of {@link AdminProductCategoriesResource} used to send requests to [Admin Product Category API Routes](https://docs.medusajs.com/api/admin#product-categories).
   */
  public productCategories = new AdminProductCategoriesResource(this.client)
  /**
   * An instance of {@link AdminCustomResource} used to send requests to custom API Routes.
   */
  public custom = new AdminCustomResource(this.client)
}

export {
  Admin,
  AdminCustomResource,
  AdminAuthResource,
  AdminBatchJobsResource,
  AdminCollectionsResource,
  AdminCurrenciesResource,
  AdminCustomerGroupsResource,
  AdminCustomersResource,
  AdminDiscountsResource,
  AdminDraftOrdersResource,
  AdminGiftCardsResource,
  AdminInventoryItemsResource,
  AdminInvitesResource,
  AdminNotesResource,
  AdminNotificationsResource,
  AdminOrdersResource,
  AdminOrderEditsResource,
  AdminPriceListResource,
  AdminProductTagsResource,
  AdminProductTypesResource,
  AdminProductsResource,
  AdminPublishableApiKeyResource,
  AdminRegionsResource,
  AdminReservationsResource,
  AdminReturnReasonsResource,
  AdminReturnsResource,
  AdminSalesChannelsResource,
  AdminShippingOptionsResource,
  AdminShippingProfilesResource,
  AdminStockLocationsResource,
  AdminStoresResource,
  AdminSwapsResource,
  AdminTaxRatesResource,
  AdminUploadsResource,
  AdminUsersResource,
  AdminVariantsResource,
  AdminPaymentCollectionsResource,
  AdminPaymentsResource,
  AdminProductCategoriesResource,
}

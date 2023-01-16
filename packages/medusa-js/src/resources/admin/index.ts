import BaseResource from "../base"
import AdminAuthResource from "./auth"
import AdminBatchJobsResource from "./batch-jobs"
import CollectionsResource from "./collections"
import AdminCurrenciesResource from "./currencies"
import AdminCustomerGroupsResource from "./customer-groups"
import AdminCustomersResource from "./customers"
import AdminDiscountsResource from "./discounts"
import AdminDraftOrdersResource from "./draft-orders"
import AdminGiftCardsResource from "./gift-cards"
import AdminInvitesResource from "./invites"
import AdminNotesResource from "./notes"
import AdminNotificationsResource from "./notifications"
import AdminOrdersResource from "./orders"
import AdminOrderEditsResource from "./order-edits"
import AdminPriceListResource from "./price-lists"
import AdminProductTagsResource from "./product-tags"
import AdminProductTypesResource from "./product-types"
import AdminProductsResource from "./products"
import AdminPublishableApiKeyResource from "./publishable-api-keys"
import AdminRegionsResource from "./regions"
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
import AdminPaymentCollectionsResource from "./payment-collections"
import AdminPaymentsResource from "./payments"

class Admin extends BaseResource {
  public auth = new AdminAuthResource(this.client)
  public batchJobs = new AdminBatchJobsResource(this.client)
  public customers = new AdminCustomersResource(this.client)
  public customerGroups = new AdminCustomerGroupsResource(this.client)
  public discounts = new AdminDiscountsResource(this.client)
  public currencies = new AdminCurrenciesResource(this.client)
  public collections = new CollectionsResource(this.client)
  public draftOrders = new AdminDraftOrdersResource(this.client)
  public giftCards = new AdminGiftCardsResource(this.client)
  public invites = new AdminInvitesResource(this.client)
  public notes = new AdminNotesResource(this.client)
  public priceLists = new AdminPriceListResource(this.client)
  public products = new AdminProductsResource(this.client)
  public productTags = new AdminProductTagsResource(this.client)
  public productTypes = new AdminProductTypesResource(this.client)
  public users = new AdminUsersResource(this.client)
  public returns = new AdminReturnsResource(this.client)
  public orders = new AdminOrdersResource(this.client)
  public orderEdits = new AdminOrderEditsResource(this.client)
  public publishableApiKeys = new AdminPublishableApiKeyResource(this.client)
  public returnReasons = new AdminReturnReasonsResource(this.client)
  public variants = new AdminVariantsResource(this.client)
  public salesChannels = new AdminSalesChannelsResource(this.client)
  public swaps = new AdminSwapsResource(this.client)
  public shippingProfiles = new AdminShippingProfilesResource(this.client)
  public stockLocations = new AdminStockLocationsResource(this.client)
  public store = new AdminStoresResource(this.client)
  public shippingOptions = new AdminShippingOptionsResource(this.client)
  public regions = new AdminRegionsResource(this.client)
  public notifications = new AdminNotificationsResource(this.client)
  public taxRates = new AdminTaxRatesResource(this.client)
  public uploads = new AdminUploadsResource(this.client)
  public paymentCollections = new AdminPaymentCollectionsResource(this.client)
  public payments = new AdminPaymentsResource(this.client)
}

export default Admin

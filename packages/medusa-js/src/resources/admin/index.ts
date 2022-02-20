import BaseResource from "../base"
import AdminAuthResource from "./auth"
import AdminCustomersResource from "./customers"
import AdminDiscountsResource from "./discounts"
import CollectionsResource from "./collections"
import AdminDraftOrdersResource from "./draft-orders"
import AdminGiftCardsResource from "./gift-cards"
import AdminInvitesResource from "./invites"
import AdminNotesResource from "./notes"
import AdminProductsResource from "./products"
import AdminProductTypesResource from "./product-types"
import AdminUsersResource from "./users"
import AdminReturnsResource from "./returns"
import AdminOrdersResource from "./orders"
import AdminReturnReasonsResource from "./return-reasons"
import AdminVariantsResource from "./variants"
import AdminSwapsResource from "./swaps"
import AdminTaxRatesResource from "./tax-rates"
import AdminShippingProfilesResource from "./shipping-profiles"
import AdminStoresResource from "./store"
import AdminShippingOptionsResource from "./shipping-options"
import AdminRegionsResource from "./regions"
import AdminNotificationsResource from "./notifications"
import AdminUploadsResource from "./uploads"
import AdminProductTagsResource from "./product-tags"

class Admin extends BaseResource {
  public auth = new AdminAuthResource(this.client)
  public customers = new AdminCustomersResource(this.client)
  public discounts = new AdminDiscountsResource(this.client)
  public collections = new CollectionsResource(this.client)
  public draftOrders = new AdminDraftOrdersResource(this.client)
  public giftCards = new AdminGiftCardsResource(this.client)
  public invites = new AdminInvitesResource(this.client)
  public notes = new AdminNotesResource(this.client)
  public products = new AdminProductsResource(this.client)
  public productTags = new AdminProductTagsResource(this.client)
  public productTypes = new AdminProductTypesResource(this.client)
  public users = new AdminUsersResource(this.client)
  public returns = new AdminReturnsResource(this.client)
  public orders = new AdminOrdersResource(this.client)
  public returnReasons = new AdminReturnReasonsResource(this.client)
  public variants = new AdminVariantsResource(this.client)
  public swaps = new AdminSwapsResource(this.client)
  public shippingProfiles = new AdminShippingProfilesResource(this.client)
  public store = new AdminStoresResource(this.client)
  public shippingOptions = new AdminShippingOptionsResource(this.client)
  public regions = new AdminRegionsResource(this.client)
  public notifications = new AdminNotificationsResource(this.client)
  public taxRates = new AdminTaxRatesResource(this.client)
  public uploads = new AdminUploadsResource(this.client)
}

export default Admin

import BaseResource from "../base"
import AdminAuthResource from "./auth"
import AdminCustomersResource from "./customers"
import AdminDiscountsResource from "./discounts"
import CollectionsResource from "./collections"
import AdminDraftOrdersResource from "./draft-orders"
import AdminGiftCardsResource from "./gift-cards"
import AdminInvitesResource from "./invites"
import AdminNotesResource from "./notes"
import AdminOrdersResource from "./orders"
import AdminReturnReasonsResource from "./return-reasons"
import AdminVariantsResource from "./variants"
import AdminSwapsResource from "./swaps"
import AdminShippingProfilesResource from "./shipping-profiles"
import AdminShippingOptionsResource from "./shipping-options"
import AdminRegionsResource from "./regions"

class Admin extends BaseResource {
  public auth = new AdminAuthResource(this.client)
  public customers = new AdminCustomersResource(this.client)
  public discounts = new AdminDiscountsResource(this.client)
  public collections = new CollectionsResource(this.client)
  public draftOrders = new AdminDraftOrdersResource(this.client)
  public giftCards = new AdminGiftCardsResource(this.client)
  public invites = new AdminInvitesResource(this.client)
  public notes = new AdminNotesResource(this.client)
  public orders = new AdminOrdersResource(this.client)
  public returnReasons = new AdminReturnReasonsResource(this.client)
  public variants = new AdminVariantsResource(this.client)
  public swaps = new AdminSwapsResource(this.client)
  public shippingProfiles = new AdminShippingProfilesResource(this.client)
  public shippingOptions = new AdminShippingOptionsResource(this.client)
  public regions = new AdminRegionsResource(this.client)
}

export default Admin

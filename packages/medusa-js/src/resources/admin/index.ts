import BaseResource from "../base"
import AdminAuthResource from "./auth"
import AdminCustomersResource from "./customers"
import AdminDiscountsResource from "./discounts"
import AdminDraftOrdersResource from "./draft-orders"
import AdminGiftCardsResource from "./gift-cards"

class Admin extends BaseResource {
  public auth = new AdminAuthResource(this.client)
  public customers = new AdminCustomersResource(this.client)
  public discounts = new AdminDiscountsResource(this.client)
  public draftOrders = new AdminDraftOrdersResource(this.client)
  public giftCards = new AdminGiftCardsResource(this.client)
}

export default Admin

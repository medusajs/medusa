import * as Apps from "../../generated/admin/apps/apps"
import * as Auth from "../../generated/admin/auth/auth"
import * as Claim from "../../generated/admin/claim/claim"
import * as Collection from "../../generated/admin/collection/collection"
import * as Customer from "../../generated/admin/customer/customer"
import * as CustomerGroup from "../../generated/admin/customer-group/customer-group"
import * as Discount from "../../generated/admin/discount/discount"
import * as DraftOrder from "../../generated/admin/draft-order/draft-order"
import * as Fulfillment from "../../generated/admin/fulfillment/fulfillment"
import * as GiftCard from "../../generated/admin/gift-card/gift-card"
import * as Invite from "../../generated/admin/invites/invites"
import * as Note from "../../generated/admin/note/note"
import * as Notification from "../../generated/admin/notification/notification"
import * as Order from "../../generated/admin/order/order"
import * as Product from "../../generated/admin/product/product"
import * as ProductTag from "../../generated/admin/product-tag/product-tag"
import * as ProductVariant from "../../generated/admin/product-variant/product-variant"
import * as Region from "../../generated/admin/region/region"
import * as Return from "../../generated/admin/return/return"
import * as ReturnReason from "../../generated/admin/return-reason/return-reason"
import * as ShippingOption from "../../generated/admin/shipping-option/shipping-option"
import * as ShippingProfile from "../../generated/admin/shipping-profile/shipping-profile"
import * as Store from "../../generated/admin/store/store"
import * as Swap from "../../generated/admin/swap/swap"
import * as TaxRate from "../../generated/admin/tax-rates/tax-rates"
import * as Upload from "../../generated/admin/uploads/uploads"
import * as User from "../../generated/admin/users/users"
import * as PriceList from "../../generated/admin/price-list/price-list"

class MedusaAdmin {
  public apps: typeof Apps
  public auth: typeof Auth
  public claims: typeof Claim
  public collections: typeof Collection
  public customers: typeof Customer
  public customerGroups: typeof CustomerGroup
  public discounts: typeof Discount
  public draftOrders: typeof DraftOrder
  public fulfillments: typeof Fulfillment
  public giftCards: typeof GiftCard
  public invites: typeof Invite
  public notes: typeof Note
  public notifications: typeof Notification
  public orders: typeof Order
  public products: typeof Product
  public tags: typeof ProductTag
  public variants: typeof ProductVariant
  public regions: typeof Region
  public returns: typeof Return
  public returnReasons: typeof ReturnReason
  public shippingOptions: typeof ShippingOption
  public shippingProfiles: typeof ShippingProfile
  public stores: typeof Store
  public swaps: typeof Swap
  public taxRates: typeof TaxRate
  public uploads: typeof Upload
  public users: typeof User
  public priceLists: typeof PriceList

  constructor() {
    this.apps = Apps
    this.auth = Auth
    this.claims = Claim
    this.collections = Collection
    this.customers = Customer
    this.customerGroups = CustomerGroup
    this.discounts = Discount
    this.draftOrders = DraftOrder
    this.fulfillments = Fulfillment
    this.giftCards = GiftCard
    this.invites = Invite
    this.notes = Note
    this.notifications = Notification
    this.orders = Order
    this.products = Product
    this.tags = ProductTag
    this.variants = ProductVariant
    this.regions = Region
    this.returns = Return
    this.returnReasons = ReturnReason
    this.shippingOptions = ShippingOption
    this.shippingProfiles = ShippingProfile
    this.stores = Store
    this.swaps = Swap
    this.taxRates = TaxRate
    this.uploads = Upload
    this.users = User
    this.priceLists = PriceList
  }
}

export default MedusaAdmin

import * as Auth from "../../generated/store/auth/auth"
import * as Cart from "../../generated/store/cart/cart"
import * as Collection from "../../generated/store/collection/collection"
import * as Customer from "../../generated/store/customer/customer"
import * as GiftCard from "../../generated/store/gift-card/gift-card"
import * as Order from "../../generated/store/order/order"
import * as Product from "../../generated/store/product/product"
import * as ProductVariant from "../../generated/store/product-variant/product-variant"
import * as Region from "../../generated/store/region/region"
import * as Return from "../../generated/store/return/return"
import * as ReturnReason from "../../generated/store/return-reason/return-reason"
import * as ShippingOption from "../../generated/store/shipping-option/shipping-option"
import * as Swap from "../../generated/store/swap/swap"

class Medusa {
  public auth: typeof Auth
  public carts: typeof Cart
  public collections: typeof Collection
  public customers: typeof Customer
  public giftCards: typeof GiftCard
  public orders: typeof Order
  public products: typeof Product
  public variants: typeof ProductVariant
  public regions: typeof Region
  public returns: typeof Return
  public returnReasons: typeof ReturnReason
  public shippingOptions: typeof ShippingOption
  public swaps: typeof Swap

  constructor() {
    this.auth = Auth
    this.carts = Cart
    this.collections = Collection
    this.customers = Customer
    this.giftCards = GiftCard
    this.orders = Order
    this.products = Product
    this.variants = ProductVariant
    this.regions = Region
    this.returns = Return
    this.returnReasons = ReturnReason
    this.shippingOptions = ShippingOption
    this.swaps = Swap
  }
}

export default Medusa

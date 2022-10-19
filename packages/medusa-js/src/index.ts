import MedusaError from "./error"
import Client, { Config } from "./request"
import Admin from "./resources/admin"
import AuthResource from "./resources/auth"
import CartsResource from "./resources/carts"
import CollectionsResource from "./resources/collections"
import CustomersResource from "./resources/customers"
import GiftCardsResource from "./resources/gift-cards"
import OrdersResource from "./resources/orders"
import OrderEditsResource from "./resources/order-edits"
import PaymentMethodsResource from "./resources/payment-methods"
import ProductsResource from "./resources/products"
import RegionsResource from "./resources/regions"
import ReturnReasonsResource from "./resources/return-reasons"
import ReturnsResource from "./resources/returns"
import ShippingOptionsResource from "./resources/shipping-options"
import SwapsResource from "./resources/swaps"

class Medusa {
  private client: Client
  public admin: Admin

  public auth: AuthResource
  public carts: CartsResource
  public customers: CustomersResource
  public errors: MedusaError
  public orders: OrdersResource
  public orderEdits: OrderEditsResource
  public products: ProductsResource
  public regions: RegionsResource
  public returnReasons: ReturnReasonsResource
  public returns: ReturnsResource
  public shippingOptions: ShippingOptionsResource
  public swaps: SwapsResource
  public collections: CollectionsResource
  public giftCards: GiftCardsResource
  public paymentMethods: PaymentMethodsResource

  constructor(config: Config) {
    this.client = new Client(config)

    this.admin = new Admin(this.client)

    this.auth = new AuthResource(this.client)
    this.carts = new CartsResource(this.client)
    this.customers = new CustomersResource(this.client)
    this.errors = new MedusaError()
    this.orders = new OrdersResource(this.client)
    this.orderEdits = new OrderEditsResource(this.client)
    this.products = new ProductsResource(this.client)
    this.regions = new RegionsResource(this.client)
    this.returnReasons = new ReturnReasonsResource(this.client)
    this.returns = new ReturnsResource(this.client)
    this.shippingOptions = new ShippingOptionsResource(this.client)
    this.swaps = new SwapsResource(this.client)
    this.collections = new CollectionsResource(this.client)
    this.giftCards = new GiftCardsResource(this.client)
    this.paymentMethods = new PaymentMethodsResource(this.client)
  }
}

export default Medusa

export * from "./typings"

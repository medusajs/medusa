import MedusaError from "./error"
import KeyManager from "./key-manager"
import Client, { Config } from "./request"
import {
  Admin,
  AuthResource,
  CartsResource,
  CollectionsResource,
  CustomersResource,
  GiftCardsResource,
  OrderEditsResource,
  OrdersResource,
  PaymentCollectionsResource,
  PaymentMethodsResource,
  ProductCategoriesResource,
  ProductsResource,
  ProductTagsResource,
  ProductTypesResource,
  RegionsResource,
  ReturnReasonsResource,
  ReturnsResource,
  ShippingOptionsResource,
  SwapsResource,
} from "./resources"

class Medusa {
  public client: Client
  public admin: Admin

  public auth: AuthResource
  public carts: CartsResource
  public customers: CustomersResource
  public errors: MedusaError
  public orders: OrdersResource
  public orderEdits: OrderEditsResource
  public products: ProductsResource
  public productTypes: ProductTypesResource
  public regions: RegionsResource
  public returnReasons: ReturnReasonsResource
  public returns: ReturnsResource
  public shippingOptions: ShippingOptionsResource
  public swaps: SwapsResource
  public collections: CollectionsResource
  public giftCards: GiftCardsResource
  public paymentMethods: PaymentMethodsResource
  public paymentCollections: PaymentCollectionsResource
  public productTags: ProductTagsResource
  public productCategories: ProductCategoriesResource

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
    this.productTypes = new ProductTypesResource(this.client)
    this.regions = new RegionsResource(this.client)
    this.returnReasons = new ReturnReasonsResource(this.client)
    this.returns = new ReturnsResource(this.client)
    this.shippingOptions = new ShippingOptionsResource(this.client)
    this.swaps = new SwapsResource(this.client)
    this.collections = new CollectionsResource(this.client)
    this.giftCards = new GiftCardsResource(this.client)
    this.paymentMethods = new PaymentMethodsResource(this.client)
    this.paymentCollections = new PaymentCollectionsResource(this.client)
    this.productTags = new ProductTagsResource(this.client)
    this.productCategories = new ProductCategoriesResource(this.client)
  }

  /**
   * Set a PublishableApiKey that will be sent with each request
   * to define the scope of available resources.
   *
   * @param key - PublishableApiKey identifier
   */
  setPublishableKey(key: string) {
    KeyManager.registerPublishableApiKey(key)
  }
}

export default Medusa
export { default as MedusaError } from "./error"
export { default as KeyManager } from "./key-manager"
export { Config, default as Client } from "./request"
export * from "./resources"
export * from "./typings"

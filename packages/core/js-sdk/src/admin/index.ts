import { Client } from "../client"
import { Customer } from "./customer"
import { Fulfillment } from "./fulfillment"
import { FulfillmentProvider } from "./fulfillment-provider"
import { FulfillmentSet } from "./fulfillment-set"
import { InventoryItem } from "./inventory-item"
import { Invite } from "./invite"
import { Order } from "./order"
import { PriceList } from "./price-list"
import { Product } from "./product"
import { ProductCategory } from "./product-category"
import { ProductCollection } from "./product-collection"
import { ProductType } from "./product-type"
import { Region } from "./region"
import { SalesChannel } from "./sales-channel"
import { ShippingOption } from "./shipping-option"
import { ShippingProfile } from "./shipping-profile"
import { StockLocation } from "./stock-location"
import { Store } from "./store"
import { TaxRate } from "./tax-rate"
import { TaxRegion } from "./tax-region"
import { Upload } from "./upload"

export class Admin {
  public invite: Invite
  public customer: Customer
  public productCollection: ProductCollection
  public productCategory: ProductCategory
  public priceList: PriceList
  public product: Product
  public productType: ProductType
  public upload: Upload
  public region: Region
  public stockLocation: StockLocation
  public salesChannel: SalesChannel
  public fulfillmentSet: FulfillmentSet
  public fulfillment: Fulfillment
  public fulfillmentProvider: FulfillmentProvider
  public shippingOption: ShippingOption
  public shippingProfile: ShippingProfile
  public inventoryItem: InventoryItem
  public order: Order
  public taxRate: TaxRate
  public taxRegion: TaxRegion
  public store: Store

  constructor(client: Client) {
    this.invite = new Invite(client)
    this.customer = new Customer(client)
    this.productCollection = new ProductCollection(client)
    this.productCategory = new ProductCategory(client)
    this.priceList = new PriceList(client)
    this.product = new Product(client)
    this.productType = new ProductType(client)
    this.upload = new Upload(client)
    this.region = new Region(client)
    this.stockLocation = new StockLocation(client)
    this.salesChannel = new SalesChannel(client)
    this.fulfillmentSet = new FulfillmentSet(client)
    this.fulfillment = new Fulfillment(client)
    this.fulfillmentProvider = new FulfillmentProvider(client)
    this.shippingOption = new ShippingOption(client)
    this.shippingProfile = new ShippingProfile(client)
    this.inventoryItem = new InventoryItem(client)
    this.order = new Order(client)
    this.taxRate = new TaxRate(client)
    this.taxRegion = new TaxRegion(client)
    this.store = new Store(client)
  }
}

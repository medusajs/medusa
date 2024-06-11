import { Client } from "../client"
import { Customer } from "./customer"
import { Fulfillment } from "./fulfillment"
import { FulfillmentSet } from "./fulfillment-set"
import { Invite } from "./invite"
import { Order } from "./order"
import { Product } from "./product"
import { ProductCategory } from "./product-category"
import { ProductCollection } from "./product-collection"
import { Region } from "./region"
import { SalesChannel } from "./sales-channel"
import { ShippingOption } from "./shipping-option"
import { ShippingProfile } from "./shipping-profile"
import { StockLocation } from "./stock-location"
import { TaxRate } from "./tax-rate"
import { TaxRegion } from "./tax-region"
import { Upload } from "./upload"
import { InventoryItem } from "./inventory-item"

export class Admin {
  public invite: Invite
  public customer: Customer
  public productCollection: ProductCollection
  public productCategory: ProductCategory
  public product: Product
  public upload: Upload
  public region: Region
  public stockLocation: StockLocation
  public salesChannel: SalesChannel
  public fulfillmentSet: FulfillmentSet
  public fulfillment: Fulfillment
  public shippingOption: ShippingOption
  public shippingProfile: ShippingProfile
  public inventoryItem: InventoryItem
  public order: Order
  public taxRate: TaxRate
  public taxRegion: TaxRegion

  constructor(client: Client) {
    this.invite = new Invite(client)
    this.customer = new Customer(client)
    this.productCollection = new ProductCollection(client)
    this.productCategory = new ProductCategory(client)
    this.product = new Product(client)
    this.upload = new Upload(client)
    this.region = new Region(client)
    this.stockLocation = new StockLocation(client)
    this.salesChannel = new SalesChannel(client)
    this.fulfillmentSet = new FulfillmentSet(client)
    this.fulfillment = new Fulfillment(client)
    this.shippingOption = new ShippingOption(client)
    this.shippingProfile = new ShippingProfile(client)
    this.inventoryItem = new InventoryItem(client)
    this.order = new Order(client)
    this.taxRate = new TaxRate(client)
    this.taxRegion = new TaxRegion(client)
  }
}

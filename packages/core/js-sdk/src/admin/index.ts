import { Client } from "../client"
import { ApiKey } from "./api-key"
import { Campaign } from "./campaign"
import { Claim } from "./claim"
import { Currency } from "./currency"
import { Customer } from "./customer"
import { CustomerGroup } from "./customer-group"
import { Exchange } from "./exchange"
import { Fulfillment } from "./fulfillment"
import { FulfillmentProvider } from "./fulfillment-provider"
import { FulfillmentSet } from "./fulfillment-set"
import { InventoryItem } from "./inventory-item"
import { Invite } from "./invite"
import { Notification } from "./notification"
import { Order } from "./order"
import { OrderEdit } from "./order-edit"
import { Payment } from "./payment"
import { PaymentCollection } from "./payment-collection"
import { PriceList } from "./price-list"
import { PricePreference } from "./price-preference"
import { Product } from "./product"
import { ProductCategory } from "./product-category"
import { ProductCollection } from "./product-collection"
import { ProductTag } from "./product-tag"
import { ProductType } from "./product-type"
import { ProductVariant } from "./product-variant"
import { Promotion } from "./promotion"
import { RefundReason } from "./refund-reasons"
import { Region } from "./region"
import Reservation from "./reservation"
import { Return } from "./return"
import { ReturnReason } from "./return-reason"
import { SalesChannel } from "./sales-channel"
import { ShippingOption } from "./shipping-option"
import { ShippingProfile } from "./shipping-profile"
import { StockLocation } from "./stock-location"
import { Store } from "./store"
import { TaxRate } from "./tax-rate"
import { TaxRegion } from "./tax-region"
import { Upload } from "./upload"
import { User } from "./user"
import { WorkflowExecution } from "./workflow-execution"

export class Admin {
  public invite: Invite
  public customer: Customer
  public productCollection: ProductCollection
  public productCategory: ProductCategory
  public priceList: PriceList
  public pricePreference: PricePreference
  public product: Product
  public productType: ProductType
  public upload: Upload
  public region: Region
  public returnReason: ReturnReason
  public stockLocation: StockLocation
  public salesChannel: SalesChannel
  public fulfillmentSet: FulfillmentSet
  public fulfillment: Fulfillment
  public fulfillmentProvider: FulfillmentProvider
  public shippingOption: ShippingOption
  public shippingProfile: ShippingProfile
  public inventoryItem: InventoryItem
  public notification: Notification
  public order: Order
  public orderEdit: OrderEdit
  public return: Return
  public claim: Claim
  public exchange: Exchange
  public taxRate: TaxRate
  public taxRegion: TaxRegion
  public store: Store
  public productTag: ProductTag
  public user: User
  public currency: Currency
  public payment: Payment
  public productVariant: ProductVariant
  public refundReason: RefundReason
  public paymentCollection: PaymentCollection
  public apiKey: ApiKey
  public workflowExecution: WorkflowExecution
  public reservation: Reservation
  public customerGroup: CustomerGroup
  public promotion: Promotion
  public campaign: Campaign

  constructor(client: Client) {
    this.invite = new Invite(client)
    this.customer = new Customer(client)
    this.productCollection = new ProductCollection(client)
    this.productCategory = new ProductCategory(client)
    this.priceList = new PriceList(client)
    this.pricePreference = new PricePreference(client)
    this.product = new Product(client)
    this.productType = new ProductType(client)
    this.upload = new Upload(client)
    this.region = new Region(client)
    this.returnReason = new ReturnReason(client)
    this.stockLocation = new StockLocation(client)
    this.salesChannel = new SalesChannel(client)
    this.fulfillmentSet = new FulfillmentSet(client)
    this.fulfillment = new Fulfillment(client)
    this.fulfillmentProvider = new FulfillmentProvider(client)
    this.shippingOption = new ShippingOption(client)
    this.shippingProfile = new ShippingProfile(client)
    this.inventoryItem = new InventoryItem(client)
    this.notification = new Notification(client)
    this.order = new Order(client)
    this.orderEdit = new OrderEdit(client)
    this.return = new Return(client)
    this.claim = new Claim(client)
    this.taxRate = new TaxRate(client)
    this.taxRegion = new TaxRegion(client)
    this.store = new Store(client)
    this.productTag = new ProductTag(client)
    this.user = new User(client)
    this.currency = new Currency(client)
    this.payment = new Payment(client)
    this.productVariant = new ProductVariant(client)
    this.refundReason = new RefundReason(client)
    this.exchange = new Exchange(client)
    this.paymentCollection = new PaymentCollection(client)
    this.apiKey = new ApiKey(client)
    this.workflowExecution = new WorkflowExecution(client)
    this.reservation = new Reservation(client)
    this.customerGroup = new CustomerGroup(client)
    this.promotion = new Promotion(client)
    this.campaign = new Campaign(client)
  }
}

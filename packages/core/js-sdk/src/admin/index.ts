import { Client } from "../client"
import { ApiKey } from "./api-key"
import { Campaign } from "./campaign"
import { Claim } from "./claim"
import { Currency } from "./currency"
import { Customer } from "./customer"
import { CustomerGroup } from "./customer-group"
import { DraftOrder } from "./draft-order"
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
import { Plugin } from "./plugin"
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
import { TaxProvider } from "./tax-provider"
import { TaxRate } from "./tax-rate"
import { TaxRegion } from "./tax-region"
import { Upload } from "./upload"
import { User } from "./user"
import { Views } from "./views"
import { WorkflowExecution } from "./workflow-execution"
import { ShippingOptionType } from "./shipping-option-type"
import { Locale } from "./locale"
import { Translation } from "./translation"

export class Admin {
  /**
   * @tags user
   */
  public invite: Invite
  /**
   * @tags customer
   */
  public customer: Customer
  /**
   * @tags product
   */
  public productCollection: ProductCollection
  /**
   * @tags product
   */
  public productCategory: ProductCategory
  /**
   * @tags pricing
   */
  public priceList: PriceList
  /**
   * @tags pricing
   */
  public pricePreference: PricePreference
  /**
   * @tags product
   */
  public product: Product
  /**
   * @tags product
   */
  public productType: ProductType
  /**
   * @tags file
   */
  public upload: Upload
  /**
   * @tags region
   */
  public region: Region
  /**
   * @tags order
   */
  public returnReason: ReturnReason
  /**
   * @tags stock location
   */
  public stockLocation: StockLocation
  /**
   * @tags sales channel
   */
  public salesChannel: SalesChannel
  /**
   * @tags fulfillment
   */
  public fulfillmentSet: FulfillmentSet
  /**
   * @tags fulfillment
   */
  public fulfillment: Fulfillment
  /**
   * @tags fulfillment
   */
  public fulfillmentProvider: FulfillmentProvider
  /**
   * @tags fulfillment
   */
  public shippingOption: ShippingOption
  /**
   * @tags fulfillment
   */
  public shippingOptionType: ShippingOptionType
  /**
   * @tags fulfillment
   */
  public shippingProfile: ShippingProfile
  /**
   * @tags inventory
   */
  public inventoryItem: InventoryItem
  /**
   * @tags notification
   */
  public notification: Notification
  /**
   * @tags order
   */
  public order: Order
  /**
   * @tags order
   */
  public draftOrder: DraftOrder
  /**
   * @tags order
   */
  public orderEdit: OrderEdit
  /**
   * @tags order
   */
  public return: Return
  /**
   * @tags order
   */
  public claim: Claim
  /**
   * @tags order
   */
  public exchange: Exchange
  /**
   * @tags tax
   */
  public taxRate: TaxRate
  /**
   * @tags tax
   */
  public taxRegion: TaxRegion
  /**
   * @tags store
   */
  public store: Store
  /**
   * @tags product
   */
  public productTag: ProductTag
  /**
   * @tags user
   */
  public user: User
  /**
   * @tags currency
   */
  public currency: Currency
  /**
   * @tags locale
   * @since 2.12.3
   */
  public locale: Locale
  /**
   * @tags payment
   */
  public payment: Payment
  /**
   * @tags product
   */
  public productVariant: ProductVariant
  /**
   * @tags order
   */
  public refundReason: RefundReason
  /**
   * @tags payment
   */
  public paymentCollection: PaymentCollection
  /**
   * @tags api key
   */
  public apiKey: ApiKey
  /**
   * @tags workflow
   */
  public workflowExecution: WorkflowExecution
  /**
   * @tags inventory
   */
  public reservation: Reservation
  /**
   * @tags customer
   */
  public customerGroup: CustomerGroup
  /**
   * @tags promotion
   */
  public promotion: Promotion
  /**
   * @tags tax
   */
  public taxProvider: TaxProvider
  /**
   * @tags translations
   */
  public translation: Translation
  /**
   * @tags promotion
   */
  public campaign: Campaign
  /**
   * @tags plugin
   */
  public plugin: Plugin
  /**
   * @tags views
   * @featureFlag view_configurations
   */
  public views: Views

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
    this.shippingOptionType = new ShippingOptionType(client)
    this.shippingProfile = new ShippingProfile(client)
    this.inventoryItem = new InventoryItem(client)
    this.notification = new Notification(client)
    this.order = new Order(client)
    this.draftOrder = new DraftOrder(client)
    this.orderEdit = new OrderEdit(client)
    this.return = new Return(client)
    this.claim = new Claim(client)
    this.taxRate = new TaxRate(client)
    this.taxRegion = new TaxRegion(client)
    this.translation = new Translation(client)
    this.store = new Store(client)
    this.productTag = new ProductTag(client)
    this.user = new User(client)
    this.locale = new Locale(client)
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
    this.plugin = new Plugin(client)
    this.taxProvider = new TaxProvider(client)
    this.views = new Views(client)
  }
}

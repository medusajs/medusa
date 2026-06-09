import { Client } from "../client.js"
import { ApiKey } from "./api-key.js"
import { Campaign } from "./campaign.js"
import { Claim } from "./claim.js"
import { Currency } from "./currency.js"
import { Customer } from "./customer.js"
import { CustomerGroup } from "./customer-group.js"
import { DraftOrder } from "./draft-order.js"
import { Exchange } from "./exchange.js"
import { Fulfillment } from "./fulfillment.js"
import { FulfillmentProvider } from "./fulfillment-provider.js"
import { FulfillmentSet } from "./fulfillment-set.js"
import { InventoryItem } from "./inventory-item.js"
import { Invite } from "./invite.js"
import { Notification } from "./notification.js"
import { Order } from "./order.js"
import { OrderEdit } from "./order-edit.js"
import { Payment } from "./payment.js"
import { PaymentCollection } from "./payment-collection.js"
import { Plugin } from "./plugin.js"
import { PriceList } from "./price-list.js"
import { PricePreference } from "./price-preference.js"
import { Product } from "./product.js"
import { ProductCategory } from "./product-category.js"
import { ProductCollection } from "./product-collection.js"
import { ProductTag } from "./product-tag.js"
import { ProductType } from "./product-type.js"
import { ProductVariant } from "./product-variant.js"
import { Promotion } from "./promotion.js"
import { RefundReason } from "./refund-reasons.js"
import { Region } from "./region.js"
import Reservation from "./reservation.js"
import { Return } from "./return.js"
import { ReturnReason } from "./return-reason.js"
import { SalesChannel } from "./sales-channel.js"
import { ShippingOption } from "./shipping-option.js"
import { ShippingProfile } from "./shipping-profile.js"
import { StockLocation } from "./stock-location.js"
import { Store } from "./store.js"
import { TaxProvider } from "./tax-provider.js"
import { TaxRate } from "./tax-rate.js"
import { TaxRegion } from "./tax-region.js"
import { Upload } from "./upload.js"
import { User } from "./user.js"
import { Views } from "./views.js"
import { WorkflowExecution } from "./workflow-execution.js"
import { ShippingOptionType } from "./shipping-option-type.js"
import { Locale } from "./locale.js"
import { Translation } from "./translation.js"
import { RbacRole } from "./rbac-role"
import { RbacPolicy } from "./rbac-policy"

/**
 * The admin client provides access to admin-related resources.
 */
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
  /**
   * @tags rbac
   * @since 2.15.5
   */
  public rbacRole: RbacRole
  /**
   * @tags rbac
   * @since 2.15.5
   */
  public rbacPolicy: RbacPolicy

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
    this.rbacRole = new RbacRole(client)
    this.rbacPolicy = new RbacPolicy(client)
  }
}

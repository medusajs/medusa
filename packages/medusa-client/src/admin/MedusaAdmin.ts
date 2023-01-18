/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { AppService } from './services/AppService';
import { AuthService } from './services/AuthService';
import { BatchJobService } from './services/BatchJobService';
import { ClaimService } from './services/ClaimService';
import { CollectionService } from './services/CollectionService';
import { CurrencyService } from './services/CurrencyService';
import { CustomerService } from './services/CustomerService';
import { CustomerGroupService } from './services/CustomerGroupService';
import { DiscountService } from './services/DiscountService';
import { DiscountConditionService } from './services/DiscountConditionService';
import { DraftOrderService } from './services/DraftOrderService';
import { FulfillmentService } from './services/FulfillmentService';
import { GiftCardService } from './services/GiftCardService';
import { InviteService } from './services/InviteService';
import { NoteService } from './services/NoteService';
import { NotificationService } from './services/NotificationService';
import { OrderService } from './services/OrderService';
import { OrderEditService } from './services/OrderEditService';
import { PaymentService } from './services/PaymentService';
import { PaymentCollectionService } from './services/PaymentCollectionService';
import { PriceListService } from './services/PriceListService';
import { ProductService } from './services/ProductService';
import { ProductCategoryService } from './services/ProductCategoryService';
import { ProductTagService } from './services/ProductTagService';
import { ProductTypeService } from './services/ProductTypeService';
import { ProductVariantService } from './services/ProductVariantService';
import { PublishableApiKeyService } from './services/PublishableApiKeyService';
import { RegionService } from './services/RegionService';
import { ReturnService } from './services/ReturnService';
import { ReturnReasonService } from './services/ReturnReasonService';
import { SalesChannelService } from './services/SalesChannelService';
import { ShippingOptionService } from './services/ShippingOptionService';
import { ShippingProfileService } from './services/ShippingProfileService';
import { StockLocationService } from './services/StockLocationService';
import { StoreService } from './services/StoreService';
import { SwapService } from './services/SwapService';
import { TaxRateService } from './services/TaxRateService';
import { UploadService } from './services/UploadService';
import { UserService } from './services/UserService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class MedusaAdmin {

  public readonly app: AppService;
  public readonly auth: AuthService;
  public readonly batchJob: BatchJobService;
  public readonly claim: ClaimService;
  public readonly collection: CollectionService;
  public readonly currency: CurrencyService;
  public readonly customer: CustomerService;
  public readonly customerGroup: CustomerGroupService;
  public readonly discount: DiscountService;
  public readonly discountCondition: DiscountConditionService;
  public readonly draftOrder: DraftOrderService;
  public readonly fulfillment: FulfillmentService;
  public readonly giftCard: GiftCardService;
  public readonly invite: InviteService;
  public readonly note: NoteService;
  public readonly notification: NotificationService;
  public readonly order: OrderService;
  public readonly orderEdit: OrderEditService;
  public readonly payment: PaymentService;
  public readonly paymentCollection: PaymentCollectionService;
  public readonly priceList: PriceListService;
  public readonly product: ProductService;
  public readonly productCategory: ProductCategoryService;
  public readonly productTag: ProductTagService;
  public readonly productType: ProductTypeService;
  public readonly productVariant: ProductVariantService;
  public readonly publishableApiKey: PublishableApiKeyService;
  public readonly region: RegionService;
  public readonly return: ReturnService;
  public readonly returnReason: ReturnReasonService;
  public readonly salesChannel: SalesChannelService;
  public readonly shippingOption: ShippingOptionService;
  public readonly shippingProfile: ShippingProfileService;
  public readonly stockLocation: StockLocationService;
  public readonly store: StoreService;
  public readonly swap: SwapService;
  public readonly taxRate: TaxRateService;
  public readonly upload: UploadService;
  public readonly user: UserService;

  public readonly request: BaseHttpRequest;

  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? 'https://api.medusa-commerce.com/admin',
      VERSION: config?.VERSION ?? '1.0.0',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });

    this.app = new AppService(this.request);
    this.auth = new AuthService(this.request);
    this.batchJob = new BatchJobService(this.request);
    this.claim = new ClaimService(this.request);
    this.collection = new CollectionService(this.request);
    this.currency = new CurrencyService(this.request);
    this.customer = new CustomerService(this.request);
    this.customerGroup = new CustomerGroupService(this.request);
    this.discount = new DiscountService(this.request);
    this.discountCondition = new DiscountConditionService(this.request);
    this.draftOrder = new DraftOrderService(this.request);
    this.fulfillment = new FulfillmentService(this.request);
    this.giftCard = new GiftCardService(this.request);
    this.invite = new InviteService(this.request);
    this.note = new NoteService(this.request);
    this.notification = new NotificationService(this.request);
    this.order = new OrderService(this.request);
    this.orderEdit = new OrderEditService(this.request);
    this.payment = new PaymentService(this.request);
    this.paymentCollection = new PaymentCollectionService(this.request);
    this.priceList = new PriceListService(this.request);
    this.product = new ProductService(this.request);
    this.productCategory = new ProductCategoryService(this.request);
    this.productTag = new ProductTagService(this.request);
    this.productType = new ProductTypeService(this.request);
    this.productVariant = new ProductVariantService(this.request);
    this.publishableApiKey = new PublishableApiKeyService(this.request);
    this.region = new RegionService(this.request);
    this.return = new ReturnService(this.request);
    this.returnReason = new ReturnReasonService(this.request);
    this.salesChannel = new SalesChannelService(this.request);
    this.shippingOption = new ShippingOptionService(this.request);
    this.shippingProfile = new ShippingProfileService(this.request);
    this.stockLocation = new StockLocationService(this.request);
    this.store = new StoreService(this.request);
    this.swap = new SwapService(this.request);
    this.taxRate = new TaxRateService(this.request);
    this.upload = new UploadService(this.request);
    this.user = new UserService(this.request);
  }
}

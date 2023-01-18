/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { AuthService } from './services/AuthService';
import { CartService } from './services/CartService';
import { CollectionService } from './services/CollectionService';
import { CustomerService } from './services/CustomerService';
import { GiftCardService } from './services/GiftCardService';
import { InviteService } from './services/InviteService';
import { OrderService } from './services/OrderService';
import { OrderEditService } from './services/OrderEditService';
import { PaymentCollectionService } from './services/PaymentCollectionService';
import { ProductService } from './services/ProductService';
import { ProductCategoryService } from './services/ProductCategoryService';
import { ProductTypeService } from './services/ProductTypeService';
import { ProductVariantService } from './services/ProductVariantService';
import { RegionService } from './services/RegionService';
import { ReturnService } from './services/ReturnService';
import { ReturnReasonService } from './services/ReturnReasonService';
import { ShippingOptionService } from './services/ShippingOptionService';
import { SwapService } from './services/SwapService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class MedusaStore {

  public readonly auth: AuthService;
  public readonly cart: CartService;
  public readonly collection: CollectionService;
  public readonly customer: CustomerService;
  public readonly giftCard: GiftCardService;
  public readonly invite: InviteService;
  public readonly order: OrderService;
  public readonly orderEdit: OrderEditService;
  public readonly paymentCollection: PaymentCollectionService;
  public readonly product: ProductService;
  public readonly productCategory: ProductCategoryService;
  public readonly productType: ProductTypeService;
  public readonly productVariant: ProductVariantService;
  public readonly region: RegionService;
  public readonly return: ReturnService;
  public readonly returnReason: ReturnReasonService;
  public readonly shippingOption: ShippingOptionService;
  public readonly swap: SwapService;

  public readonly request: BaseHttpRequest;

  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? 'https://api.medusa-commerce.com/store',
      VERSION: config?.VERSION ?? '1.0.0',
      WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
      CREDENTIALS: config?.CREDENTIALS ?? 'include',
      TOKEN: config?.TOKEN,
      USERNAME: config?.USERNAME,
      PASSWORD: config?.PASSWORD,
      HEADERS: config?.HEADERS,
      ENCODE_PATH: config?.ENCODE_PATH,
    });

    this.auth = new AuthService(this.request);
    this.cart = new CartService(this.request);
    this.collection = new CollectionService(this.request);
    this.customer = new CustomerService(this.request);
    this.giftCard = new GiftCardService(this.request);
    this.invite = new InviteService(this.request);
    this.order = new OrderService(this.request);
    this.orderEdit = new OrderEditService(this.request);
    this.paymentCollection = new PaymentCollectionService(this.request);
    this.product = new ProductService(this.request);
    this.productCategory = new ProductCategoryService(this.request);
    this.productType = new ProductTypeService(this.request);
    this.productVariant = new ProductVariantService(this.request);
    this.region = new RegionService(this.request);
    this.return = new ReturnService(this.request);
    this.returnReason = new ReturnReasonService(this.request);
    this.shippingOption = new ShippingOptionService(this.request);
    this.swap = new SwapService(this.request);
  }
}

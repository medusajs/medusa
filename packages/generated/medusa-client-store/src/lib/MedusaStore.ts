/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { AuthService } from './services/AuthService';
import { CartsService } from './services/CartsService';
import { CollectionsService } from './services/CollectionsService';
import { CustomersService } from './services/CustomersService';
import { GiftCardsService } from './services/GiftCardsService';
import { OrderEditsService } from './services/OrderEditsService';
import { OrdersService } from './services/OrdersService';
import { PaymentCollectionsService } from './services/PaymentCollectionsService';
import { ProductCategoriesService } from './services/ProductCategoriesService';
import { ProductsService } from './services/ProductsService';
import { ProductTagsService } from './services/ProductTagsService';
import { ProductTypesService } from './services/ProductTypesService';
import { RegionsService } from './services/RegionsService';
import { ReturnReasonsService } from './services/ReturnReasonsService';
import { ReturnsService } from './services/ReturnsService';
import { ShippingOptionsService } from './services/ShippingOptionsService';
import { SwapsService } from './services/SwapsService';
import { VariantsService } from './services/VariantsService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class MedusaStore {

  public readonly auth: AuthService;
  public readonly carts: CartsService;
  public readonly collections: CollectionsService;
  public readonly customers: CustomersService;
  public readonly giftCards: GiftCardsService;
  public readonly orderEdits: OrderEditsService;
  public readonly orders: OrdersService;
  public readonly paymentCollections: PaymentCollectionsService;
  public readonly productCategories: ProductCategoriesService;
  public readonly products: ProductsService;
  public readonly productTags: ProductTagsService;
  public readonly productTypes: ProductTypesService;
  public readonly regions: RegionsService;
  public readonly returnReasons: ReturnReasonsService;
  public readonly returns: ReturnsService;
  public readonly shippingOptions: ShippingOptionsService;
  public readonly swaps: SwapsService;
  public readonly variants: VariantsService;

  public readonly request: BaseHttpRequest;

  constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
    this.request = new HttpRequest({
      BASE: config?.BASE ?? 'https://api.medusa-commerce.com',
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
    this.carts = new CartsService(this.request);
    this.collections = new CollectionsService(this.request);
    this.customers = new CustomersService(this.request);
    this.giftCards = new GiftCardsService(this.request);
    this.orderEdits = new OrderEditsService(this.request);
    this.orders = new OrdersService(this.request);
    this.paymentCollections = new PaymentCollectionsService(this.request);
    this.productCategories = new ProductCategoriesService(this.request);
    this.products = new ProductsService(this.request);
    this.productTags = new ProductTagsService(this.request);
    this.productTypes = new ProductTypesService(this.request);
    this.regions = new RegionsService(this.request);
    this.returnReasons = new ReturnReasonsService(this.request);
    this.returns = new ReturnsService(this.request);
    this.shippingOptions = new ShippingOptionsService(this.request);
    this.swaps = new SwapsService(this.request);
    this.variants = new VariantsService(this.request);
  }
}

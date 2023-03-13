/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';

import { AppsService } from './services/AppsService';
import { AuthService } from './services/AuthService';
import { BatchJobsService } from './services/BatchJobsService';
import { CollectionsService } from './services/CollectionsService';
import { CurrenciesService } from './services/CurrenciesService';
import { CustomerGroupsService } from './services/CustomerGroupsService';
import { CustomersService } from './services/CustomersService';
import { DiscountsService } from './services/DiscountsService';
import { DraftOrdersService } from './services/DraftOrdersService';
import { GiftCardsService } from './services/GiftCardsService';
import { InventoryItemsService } from './services/InventoryItemsService';
import { InvitesService } from './services/InvitesService';
import { NotesService } from './services/NotesService';
import { NotificationsService } from './services/NotificationsService';
import { OrderEditsService } from './services/OrderEditsService';
import { OrdersService } from './services/OrdersService';
import { PaymentCollectionsService } from './services/PaymentCollectionsService';
import { PaymentsService } from './services/PaymentsService';
import { PriceListsService } from './services/PriceListsService';
import { ProductCategoriesService } from './services/ProductCategoriesService';
import { ProductsService } from './services/ProductsService';
import { ProductTagsService } from './services/ProductTagsService';
import { ProductTypesService } from './services/ProductTypesService';
import { PublishableApiKeysService } from './services/PublishableApiKeysService';
import { RegionsService } from './services/RegionsService';
import { ReservationsService } from './services/ReservationsService';
import { ReturnReasonsService } from './services/ReturnReasonsService';
import { ReturnsService } from './services/ReturnsService';
import { SalesChannelsService } from './services/SalesChannelsService';
import { ShippingOptionsService } from './services/ShippingOptionsService';
import { ShippingProfilesService } from './services/ShippingProfilesService';
import { StockLocationsService } from './services/StockLocationsService';
import { StoreService } from './services/StoreService';
import { SwapsService } from './services/SwapsService';
import { TaxRatesService } from './services/TaxRatesService';
import { UploadsService } from './services/UploadsService';
import { UsersService } from './services/UsersService';
import { VariantsService } from './services/VariantsService';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class MedusaAdmin {

  public readonly apps: AppsService;
  public readonly auth: AuthService;
  public readonly batchJobs: BatchJobsService;
  public readonly collections: CollectionsService;
  public readonly currencies: CurrenciesService;
  public readonly customerGroups: CustomerGroupsService;
  public readonly customers: CustomersService;
  public readonly discounts: DiscountsService;
  public readonly draftOrders: DraftOrdersService;
  public readonly giftCards: GiftCardsService;
  public readonly inventoryItems: InventoryItemsService;
  public readonly invites: InvitesService;
  public readonly notes: NotesService;
  public readonly notifications: NotificationsService;
  public readonly orderEdits: OrderEditsService;
  public readonly orders: OrdersService;
  public readonly paymentCollections: PaymentCollectionsService;
  public readonly payments: PaymentsService;
  public readonly priceLists: PriceListsService;
  public readonly productCategories: ProductCategoriesService;
  public readonly products: ProductsService;
  public readonly productTags: ProductTagsService;
  public readonly productTypes: ProductTypesService;
  public readonly publishableApiKeys: PublishableApiKeysService;
  public readonly regions: RegionsService;
  public readonly reservations: ReservationsService;
  public readonly returnReasons: ReturnReasonsService;
  public readonly returns: ReturnsService;
  public readonly salesChannels: SalesChannelsService;
  public readonly shippingOptions: ShippingOptionsService;
  public readonly shippingProfiles: ShippingProfilesService;
  public readonly stockLocations: StockLocationsService;
  public readonly store: StoreService;
  public readonly swaps: SwapsService;
  public readonly taxRates: TaxRatesService;
  public readonly uploads: UploadsService;
  public readonly users: UsersService;
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

    this.apps = new AppsService(this.request);
    this.auth = new AuthService(this.request);
    this.batchJobs = new BatchJobsService(this.request);
    this.collections = new CollectionsService(this.request);
    this.currencies = new CurrenciesService(this.request);
    this.customerGroups = new CustomerGroupsService(this.request);
    this.customers = new CustomersService(this.request);
    this.discounts = new DiscountsService(this.request);
    this.draftOrders = new DraftOrdersService(this.request);
    this.giftCards = new GiftCardsService(this.request);
    this.inventoryItems = new InventoryItemsService(this.request);
    this.invites = new InvitesService(this.request);
    this.notes = new NotesService(this.request);
    this.notifications = new NotificationsService(this.request);
    this.orderEdits = new OrderEditsService(this.request);
    this.orders = new OrdersService(this.request);
    this.paymentCollections = new PaymentCollectionsService(this.request);
    this.payments = new PaymentsService(this.request);
    this.priceLists = new PriceListsService(this.request);
    this.productCategories = new ProductCategoriesService(this.request);
    this.products = new ProductsService(this.request);
    this.productTags = new ProductTagsService(this.request);
    this.productTypes = new ProductTypesService(this.request);
    this.publishableApiKeys = new PublishableApiKeysService(this.request);
    this.regions = new RegionsService(this.request);
    this.reservations = new ReservationsService(this.request);
    this.returnReasons = new ReturnReasonsService(this.request);
    this.returns = new ReturnsService(this.request);
    this.salesChannels = new SalesChannelsService(this.request);
    this.shippingOptions = new ShippingOptionsService(this.request);
    this.shippingProfiles = new ShippingProfilesService(this.request);
    this.stockLocations = new StockLocationsService(this.request);
    this.store = new StoreService(this.request);
    this.swaps = new SwapsService(this.request);
    this.taxRates = new TaxRatesService(this.request);
    this.uploads = new UploadsService(this.request);
    this.users = new UsersService(this.request);
    this.variants = new VariantsService(this.request);
  }
}

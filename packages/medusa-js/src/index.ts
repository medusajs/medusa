import Client from './request';
import { Config } from './request';
import CartsResource from './resources/carts';
import CustomersResource from './resources/customers';
import OrdersResource from './resources/orders';
import ProductsResource from './resources/products';
import RegionsResource from './resources/regions';
import ShippingOptionsResource from './resources/shipping-options';
import SwapsResource from './resources/swaps';
import MedusaError from './error';
import AuthResource from './resources/auth';
import ReturnReasonsResource from './resources/return-reasons';
import ReturnsResource from './resources/returns';

class Medusa {
  private client: Client;
  public auth: AuthResource;
  public carts: CartsResource;
  public customers: CustomersResource;
  public errors: MedusaError;
  public orders: OrdersResource;
  public products: ProductsResource;
  public regions: RegionsResource;
  public returnReasons: ReturnReasonsResource;
  public returns: ReturnsResource;
  public shippingOptions: ShippingOptionsResource;
  public swaps: SwapsResource;

  constructor(config: Config) {
    this.client = new Client(config);

    this.auth = new AuthResource(this.client);
    this.carts = new CartsResource(this.client);
    this.customers = new CustomersResource(this.client);
    this.errors = new MedusaError();
    this.orders = new OrdersResource(this.client);
    this.products = new ProductsResource(this.client);
    this.regions = new RegionsResource(this.client);
    this.returnReasons = new ReturnReasonsResource(this.client);
    this.returns = new ReturnsResource(this.client);
    this.shippingOptions = new ShippingOptionsResource(this.client);
    this.swaps = new SwapsResource(this.client);
  }
}

export default Medusa;

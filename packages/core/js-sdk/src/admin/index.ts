import { Client } from "../client"
import { Customer } from "./customer"
import { Invite } from "./invite"
import { Product } from "./product"
import { ProductCollection } from "./product-collection"
import { Region } from "./region"
import { Upload } from "./upload"
import { Order } from "./order"

export class Admin {
  public invite: Invite
  public customer: Customer
  public productCollection: ProductCollection
  public product: Product
  public upload: Upload
  public region: Region
  public order: Order

  constructor(client: Client) {
    this.invite = new Invite(client)
    this.customer = new Customer(client)
    this.productCollection = new ProductCollection(client)
    this.product = new Product(client)
    this.upload = new Upload(client)
    this.region = new Region(client)
    this.order = new Order(client)
  }
}

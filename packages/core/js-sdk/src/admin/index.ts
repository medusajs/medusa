import { Client } from "../client"
import { Customer } from "./customer"
import { Invite } from "./invite"
import { Product } from "./product"
import { ProductCollection } from "./product-collection"
import { Region } from "./region"
import { Upload } from "./upload"

export class Admin {
  public invite: Invite
  public customer: Customer
  public productCollection: ProductCollection
  public product: Product
  public upload: Upload
  public region: Region

  constructor(client: Client) {
    this.invite = new Invite(client)
    this.customer = new Customer(client)
    this.productCollection = new ProductCollection(client)
    this.product = new Product(client)
    this.upload = new Upload(client)
    this.region = new Region(client)
  }
}

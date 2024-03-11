import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Collection,
  Entity,
  OneToMany,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import ShippingOption from "./shipping-option"

@Entity()
export default class FulfillmentProvider {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "boolean", defaultRaw: "true" })
  is_enabled: boolean = true

  @OneToMany(
    () => ShippingOption,
    (shippingOption) => shippingOption.fulfillment_provider
  )
  shipping_options = new Collection<ShippingOption>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "serpro")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "serpro")
  }
}

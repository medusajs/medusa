import { DALUtils, generateEntityId } from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import ShippingOption from "./shipping-option"

type FulfillmentProviderOptionalProps = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentProvider {
  [OptionalProps]?: FulfillmentProviderOptionalProps

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

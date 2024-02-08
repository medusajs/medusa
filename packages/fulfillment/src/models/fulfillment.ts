// TODO: Not to be reviewed yet. Waiting discussion before continuing this part

import { DALUtils, generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import ShippingOption from "./shipping-option"
import ServiceProvider from "./service-provider"
import Address from "./address"
import FulfillmentItem from "./fulfillment-item"
import FulfillmentLabel from "./fulfillment-label"

type FulfillmentOptionalProps = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Fulfillment {
  [OptionalProps]?: FulfillmentOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  location_id: string

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  packed_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  shipped_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  delivered_at: Date | null = null

  @Property({
    columnType: "timestamptz",
    nullable: true,
  })
  canceled_at: Date | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "text" })
  provider_id: string

  @Property({ columnType: "text", nullable: true })
  shipping_option_id: string | null = null

  @ManyToOne(() => ShippingOption, { nullable: true })
  shipping_option: ShippingOption | null

  @ManyToOne(() => ServiceProvider)
  provider: ServiceProvider

  @ManyToOne(() => Address)
  delivery_address: Address

  @ManyToOne(() => FulfillmentItem)
  items: FulfillmentItem

  @OneToMany(() => FulfillmentLabel, (label) => label.fulfillment)
  labels = new Collection<FulfillmentLabel>(this)

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  updated_at: Date

  @Index({ name: "IDX_fulfillment_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ful")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ful")
  }
}

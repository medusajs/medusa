import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
import {
  BeforeCreate,
  Collection,
  Entity,
  Filter,
  ManyToOne,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Address from "./address"
import FulfillmentItem from "./fulfillment-item"
import FulfillmentLabel from "./fulfillment-label"
import ServiceProvider from "./service-provider"
import ShippingOption from "./shipping-option"

type FulfillmentOptionalProps = DAL.SoftDeletableEntityDateColumns

const FulfillmentDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const FulfillmentProviderIdIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment",
  columns: "provider_id",
  where: "deleted_at IS NULL",
})

const FulfillmentLocationIdIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment",
  columns: "location_id",
  where: "deleted_at IS NULL",
})

const FulfillmentShippingOptionIdIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment",
  columns: "shipping_option_id",
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Fulfillment {
  [OptionalProps]?: FulfillmentOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @FulfillmentLocationIdIndex.MikroORMIndex()
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

  @ManyToOne(() => ServiceProvider, {
    columnType: "text",
    fieldName: "provider_id",
    mapToPk: true,
    nullable: true,
  })
  @FulfillmentProviderIdIndex.MikroORMIndex()
  provider_id: string

  @Property({ columnType: "text", nullable: true })
  @FulfillmentShippingOptionIdIndex.MikroORMIndex()
  shipping_option_id: string | null = null

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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

  @FulfillmentDeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ful")
    this.provider_id ??= this.provider.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ful")
    this.provider_id ??= this.provider.id
  }
}

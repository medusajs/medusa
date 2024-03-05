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
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import ShippingOption from "./shipping-option"

type FulfillmentProviderOptionalProps = DAL.SoftDeletableEntityDateColumns

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_provider",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentProvider {
  [OptionalProps]?: FulfillmentProviderOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @OneToMany(
    () => ShippingOption,
    (shippingOption) => shippingOption.fulfillment_provider
  )
  shipping_options = new Collection<ShippingOption>(this)

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

  @DeletedAtIndex.MikroORMIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "serpro")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "serpro")
  }
}

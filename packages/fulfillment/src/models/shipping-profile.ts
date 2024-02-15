import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  ShippingProfileType,
} from "@medusajs/utils"

import {
  BeforeCreate,
  Collection,
  Entity,
  Enum,
  Filter,
  Index,
  OneToMany,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import ShippingOption from "./shipping-option"

type ShippingProfileOptionalProps = DAL.SoftDeletableEntityDateColumns

const deletedAtIndexName = "IDX_shipping_profile_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
  tableName: "shipping_profile",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const shippingProfileTypeIndexName = "IDX_shipping_profile_name"
const shippingProfileTypeIndexStatement = createPsqlIndexStatementHelper({
  name: shippingProfileTypeIndexName,
  tableName: "shipping_profile",
  columns: "name",
  unique: true,
  where: "deleted_at IS NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ShippingProfile {
  [OptionalProps]?: ShippingProfileOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  @Index({
    name: shippingProfileTypeIndexName,
    expression: shippingProfileTypeIndexStatement,
  })
  name: string

  @Enum({
    items: () => ShippingProfileType,
    default: ShippingProfileType.DEFAULT,
  })
  type: ShippingProfileType = ShippingProfileType.DEFAULT

  @OneToMany(
    () => ShippingOption,
    (shippingOption) => shippingOption.shipping_profile
  )
  shipping_options = new Collection<ShippingOption>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

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

  @Index({
    name: deletedAtIndexName,
    expression: deletedAtIndexStatement,
  })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "sp")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "sp")
  }
}

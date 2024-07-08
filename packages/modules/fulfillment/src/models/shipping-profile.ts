import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
  Searchable,
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
  Rel,
} from "@mikro-orm/core"
import ShippingOption from "./shipping-option"

type ShippingProfileOptionalProps = DAL.SoftDeletableModelDateColumns

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "shipping_profile",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ShippingProfileTypeIndex = createPsqlIndexStatementHelper({
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

  @Searchable()
  @Property({ columnType: "text" })
  @ShippingProfileTypeIndex.MikroORMIndex()
  name: string

  @Searchable()
  @Property({ columnType: "text" })
  type: string

  @OneToMany(
    () => ShippingOption,
    (shippingOption) => shippingOption.shipping_profile
  )
  shipping_options = new Collection<Rel<ShippingOption>>(this)

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

  @DeletedAtIndex.MikroORMIndex()
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

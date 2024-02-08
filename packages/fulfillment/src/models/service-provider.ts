import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

import {
  BeforeCreate,
  Collection,
  Entity,
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

type ServiceProviderOptionalProps = DAL.SoftDeletableEntityDateColumns

const deletedAtIndexName = "IDX_service_provider_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
  tableName: "service_provider",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ServiceProvider {
  [OptionalProps]?: ServiceProviderOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @OneToMany(
    () => ShippingOption,
    (shippingOption) => shippingOption.service_provider
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

  @Index({
    name: deletedAtIndexName,
    expression: deletedAtIndexStatement,
  })
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

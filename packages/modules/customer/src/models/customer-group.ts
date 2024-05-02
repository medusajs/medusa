import { DAL } from "@medusajs/types"
import { DALUtils, Searchable, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
  Filter,
} from "@mikro-orm/core"
import Customer from "./customer"
import CustomerGroupCustomer from "./customer-group-customer"

type OptionalGroupProps = DAL.SoftDeletableEntityDateColumns // TODO: To be revisited when more clear

@Entity({ tableName: "customer_group" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class CustomerGroup {
  [OptionalProps]: OptionalGroupProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  name: string | null = null

  @ManyToMany({
    entity: () => Customer,
    pivotEntity: () => CustomerGroupCustomer,
  })
  customers = new Collection<Customer>(this)

  @Property({ columnType: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null = null

  @Property({ columnType: "text", nullable: true })
  created_by: string | null = null

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

  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cusgroup")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cusgroup")
  }
}

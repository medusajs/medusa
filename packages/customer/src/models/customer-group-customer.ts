import { DAL } from "@medusajs/types"
import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  ManyToOne,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Customer from "./customer"
import CustomerGroup from "./customer-group"

type OptionalGroupProps = DAL.EntityDateColumns // TODO: To be revisited when more clear

@Entity({ tableName: "customer_group_customer" })
export default class CustomerGroupCustomer {
  [OptionalProps]: OptionalGroupProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToOne({
    entity: () => Customer,
    fieldName: "customer__id",
    index: "IDX_customer_group_customer_customer_id",
  })
  customer: Customer

  @ManyToOne({
    entity: () => CustomerGroup,
    fieldName: "customer_group_id",
    index: "IDX_customer_group_customer_group_id",
  })
  customer_group: CustomerGroup

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cusgc")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cusgc")
  }
}

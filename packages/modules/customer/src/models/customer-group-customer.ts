import { DAL } from "@medusajs/types"
import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import Customer from "./customer"
import CustomerGroup from "./customer-group"

type OptionalGroupProps = "customer_group" | "customer" | DAL.ModelDateColumns // TODO: To be revisited when more clear

@Entity({ tableName: "customer_group_customer" })
export default class CustomerGroupCustomer {
  [OptionalProps]: OptionalGroupProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  customer_id: string

  @Property({ columnType: "text" })
  customer_group_id: string

  @ManyToOne({
    entity: () => Customer,
    fieldName: "customer_id",
    index: "IDX_customer_group_customer_customer_id",
    cascade: [Cascade.REMOVE],
  })
  customer: Rel<Customer>

  @ManyToOne({
    entity: () => CustomerGroup,
    fieldName: "customer_group_id",
    index: "IDX_customer_group_customer_group_id",
    cascade: [Cascade.REMOVE],
  })
  customer_group: Rel<CustomerGroup>

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

  @Property({ columnType: "text", nullable: true })
  created_by: string | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cusgc")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cusgc")
  }
}

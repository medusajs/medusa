import { DAL } from "@medusajs/types"
import { generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  ManyToOne,
  Cascade,
  Index,
} from "@mikro-orm/core"
import Customer from "./customer"

type OptionalAddressProps = DAL.EntityDateColumns // TODO: To be revisited when more clear

@Entity({ tableName: "customer_address" })
@Index({
  name: "IDX_customer_address_unqiue_customer_shipping",
  expression:
    'create unique index "IDX_customer_address_unique_customer_shipping" on "customer_address" ("customer_id") where "is_default_shipping" = true',
})
@Index({
  name: "IDX_customer_address_unqiue_customer_billing",
  expression:
    'create unique index "IDX_customer_address_unqiue_customer_billing" on "customer_address" ("customer_id") where "is_default_billing" = true',
})
export default class Address {
  [OptionalProps]: OptionalAddressProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  address_name: string | null = null

  @Property({ columnType: "boolean", default: false })
  is_default_shipping: boolean = false

  @Property({ columnType: "boolean", default: false })
  is_default_billing: boolean = false

  @Property({ columnType: "text" })
  customer_id: string

  @ManyToOne(() => Customer, {
    fieldName: "customer_id",
    index: "IDX_customer_address_customer_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  customer: Customer

  @Property({ columnType: "text", nullable: true })
  company: string | null = null

  @Property({ columnType: "text", nullable: true })
  first_name: string | null = null

  @Property({ columnType: "text", nullable: true })
  last_name: string | null = null

  @Property({ columnType: "text", nullable: true })
  address_1: string | null = null

  @Property({ columnType: "text", nullable: true })
  address_2: string | null = null

  @Property({ columnType: "text", nullable: true })
  city: string | null = null

  @Property({ columnType: "text", nullable: true })
  country_code: string | null = null

  @Property({ columnType: "text", nullable: true })
  province: string | null = null

  @Property({ columnType: "text", nullable: true })
  postal_code: string | null = null

  @Property({ columnType: "text", nullable: true })
  phone: string | null = null

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
    this.id = generateEntityId(this.id, "cuaddr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cuaddr")
  }
}

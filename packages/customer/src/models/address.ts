import { DAL } from "@medusajs/types"
import { Searchable, generateEntityId } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  Index,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Customer from "./customer"

type OptionalAddressProps = DAL.EntityDateColumns // TODO: To be revisited when more clear

export const UNIQUE_CUSTOMER_SHIPPING_ADDRESS =
  "IDX_customer_address_unique_customer_shipping"
export const UNIQUE_CUSTOMER_BILLING_ADDRESS =
  "IDX_customer_address_unique_customer_billing"

@Entity({ tableName: "customer_address" })
@Index({
  name: UNIQUE_CUSTOMER_SHIPPING_ADDRESS,
  expression:
    'create unique index "IDX_customer_address_unique_customer_shipping" on "customer_address" ("customer_id") where "is_default_shipping" = true',
})
@Index({
  name: UNIQUE_CUSTOMER_BILLING_ADDRESS,
  expression:
    'create unique index "IDX_customer_address_unique_customer_billing" on "customer_address" ("customer_id") where "is_default_billing" = true',
})
export default class Address {
  [OptionalProps]: OptionalAddressProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Searchable()
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

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  company: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  first_name: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  last_name: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  address_1: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  address_2: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  city: string | null = null

  @Property({ columnType: "text", nullable: true })
  country_code: string | null = null

  @Searchable()
  @Property({ columnType: "text", nullable: true })
  province: string | null = null

  @Searchable()
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

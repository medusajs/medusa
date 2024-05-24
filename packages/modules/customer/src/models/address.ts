import { DAL } from "@medusajs/types"
import {
  createPsqlIndexStatementHelper,
  generateEntityId,
  Searchable,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Customer from "./customer"

type OptionalAddressProps = DAL.EntityDateColumns // TODO: To be revisited when more clear

const CustomerAddressUniqueCustomerShippingAddress =
  createPsqlIndexStatementHelper({
    name: "IDX_customer_address_unique_customer_shipping",
    tableName: "customer_address",
    columns: "customer_id",
    unique: true,
    where: '"is_default_shipping" = true',
  })

const CustomerAddressUniqueCustomerBillingAddress =
  createPsqlIndexStatementHelper({
    name: "IDX_customer_address_unique_customer_billing",
    tableName: "customer_address",
    columns: "customer_id",
    unique: true,
    where: '"is_default_billing" = true',
  })

@Entity({ tableName: "customer_address" })
@CustomerAddressUniqueCustomerShippingAddress.MikroORMIndex()
@CustomerAddressUniqueCustomerBillingAddress.MikroORMIndex()
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

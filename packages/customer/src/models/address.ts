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
} from "@mikro-orm/core"
import Customer from "./customer"

type OptionalAddressProps = DAL.EntityDateColumns // TODO: To be revisited when more clear

@Entity({ tableName: "customer_address" })
export default class Address {
  [OptionalProps]: OptionalAddressProps

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  customer_id: string

  @ManyToOne(() => Customer, {
    fieldName: "customer_id",
  })
  customer?: Customer

  @Property({ columnType: "text", nullable: true })
  company?: string | null

  @Property({ columnType: "text", nullable: true })
  first_name?: string | null

  @Property({ columnType: "text", nullable: true })
  last_name?: string | null

  @Property({ columnType: "text", nullable: true })
  address_1?: string | null

  @Property({ columnType: "text", nullable: true })
  address_2?: string | null

  @Property({ columnType: "text", nullable: true })
  city?: string | null

  @Property({ columnType: "text", nullable: true })
  country_code?: string | null

  @Property({ columnType: "text", nullable: true })
  province?: string | null

  @Property({ columnType: "text", nullable: true })
  postal_code?: string | null

  @Property({ columnType: "text", nullable: true })
  phone?: string | null

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null

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

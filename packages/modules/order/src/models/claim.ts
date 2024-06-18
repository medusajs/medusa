import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  BigNumber,
  ClaimType,
  MikroOrmBigNumberProperty,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OnInit,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import ClaimItem from "./claim-item"
import Order from "./order"
import OrderShippingMethod from "./order-shipping-method"
import Return from "./return"
import Transaction from "./transaction"

type OptionalOrderClaimProps = DAL.EntityDateColumns

const DisplayIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim",
  columns: "display_id",
  where: "deleted_at IS NOT NULL",
})

const OrderClaimDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const OrderIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim",
  columns: ["order_id"],
  where: "deleted_at IS NOT NULL",
})

const ReturnIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim",
  columns: "return_id",
  where: "return_id IS NOT NULL AND deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_claim" })
export default class OrderClaim {
  [OptionalProps]?: OptionalOrderClaimProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne({
    entity: () => Order,
    mapToPk: true,
    fieldName: "order_id",
    columnType: "text",
  })
  @OrderIdIndex.MikroORMIndex()
  order_id: string

  @ManyToOne(() => Order, {
    persist: false,
  })
  order: Order

  @OneToOne({
    entity: () => Return,
    mappedBy: (ret) => ret.claim,
    cascade: ["soft-remove"] as any,
    fieldName: "return_id",
    nullable: true,
    owner: true,
  })
  return: Return

  @Property({ columnType: "text", nullable: true })
  @ReturnIdIndex.MikroORMIndex()
  return_id: string | null = null

  @Property({
    columnType: "integer",
  })
  order_version: number

  @Property({ autoincrement: true, primary: false })
  @DisplayIdIndex.MikroORMIndex()
  display_id: number

  @Enum({ items: () => ClaimType })
  type: ClaimType

  @Property({ columnType: "boolean", nullable: true })
  no_notification: boolean | null = null

  @MikroOrmBigNumberProperty({
    nullable: true,
  })
  refund_amount: BigNumber | number

  @Property({ columnType: "jsonb", nullable: true })
  raw_refund_amount: BigNumberRawValue

  @OneToMany(() => ClaimItem, (item) => item.claim, {
    cascade: [Cascade.PERSIST],
  })
  additional_items = new Collection<ClaimItem>(this)

  @OneToMany(() => ClaimItem, (item) => item.claim, {
    cascade: [Cascade.PERSIST],
  })
  claim_items = new Collection<ClaimItem>(this)

  @OneToMany(
    () => OrderShippingMethod,
    (shippingMethod) => shippingMethod.claim,
    {
      cascade: [Cascade.PERSIST],
    }
  )
  shipping_methods = new Collection<OrderShippingMethod>(this)

  @OneToMany(() => Transaction, (transaction) => transaction.claim, {
    cascade: [Cascade.PERSIST],
  })
  transactions = new Collection<Transaction>(this)

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

  @Property({ columnType: "timestamptz", nullable: true })
  @OrderClaimDeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @Property({ columnType: "timestamptz", nullable: true })
  canceled_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "claim")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "claim")
  }
}

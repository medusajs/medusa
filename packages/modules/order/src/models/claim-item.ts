import { BigNumberRawValue, DAL } from "@medusajs/framework/types"
import {
  ClaimReason,
  MikroOrmBigNumberProperty,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OnInit,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import Claim from "./claim"
import OrderClaimItemImage from "./claim-item-image"
import OrderLineItem from "./line-item"

type OptionalLineItemProps = DAL.ModelDateColumns

const tableName = "order_claim_item"
const ClaimIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "claim_id",
  where: "deleted_at IS NOT NULL",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "item_id",
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName,
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName })
export default class OrderClaimItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @OneToMany(() => OrderClaimItemImage, (ci) => ci.item, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  images = new Collection<Rel<OrderClaimItemImage>>(this)

  @Enum({ items: () => ClaimReason, nullable: true })
  reason: Rel<ClaimReason> | null = null

  @MikroOrmBigNumberProperty()
  quantity: Number | number

  @Property({ columnType: "jsonb" })
  raw_quantity: BigNumberRawValue

  @ManyToOne(() => Claim, {
    columnType: "text",
    fieldName: "claim_id",
    mapToPk: true,
    onDelete: "cascade",
  })
  @ClaimIdIndex.MikroORMIndex()
  claim_id: string

  @ManyToOne(() => Claim, {
    persist: false,
  })
  claim: Rel<Claim>

  @ManyToOne({
    entity: () => OrderLineItem,
    fieldName: "item_id",
    mapToPk: true,
    columnType: "text",
  })
  @ItemIdIndex.MikroORMIndex()
  item_id: string

  @ManyToOne(() => OrderLineItem, {
    persist: false,
  })
  item: Rel<OrderLineItem>

  @Property({ columnType: "boolean", default: false })
  is_additional_item: boolean = false

  @Property({ columnType: "text", nullable: true })
  note: string

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
  @DeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "claitem")
    this.claim_id ??= this.claim?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "claitem")
    this.claim_id ??= this.claim?.id
  }
}

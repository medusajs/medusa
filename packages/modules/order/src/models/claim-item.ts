import { BigNumberRawValue, DAL } from "@medusajs/types"
import {
  ClaimReason,
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
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import Claim from "./claim"
import ClaimItemImage from "./claim-item-image"
import LineItem from "./line-item"

type OptionalLineItemProps = DAL.EntityDateColumns

const ClaimIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item",
  columns: "claim_id",
  where: "deleted_at IS NOT NULL",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item",
  columns: "item_id",
  where: "deleted_at IS NOT NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item_image",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_claim_item" })
export default class OrderClaimItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @OneToMany(() => ClaimItemImage, (ci) => ci.item, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  images = new Collection<Rel<ClaimItemImage>>(this)

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
    entity: () => LineItem,
    fieldName: "item_id",
    mapToPk: true,
    columnType: "text",
  })
  @ItemIdIndex.MikroORMIndex()
  item_id: string

  @ManyToOne(() => LineItem, {
    persist: false,
  })
  item: Rel<LineItem>

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
    this.claim_id = this.claim?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "claitem")
    this.claim_id = this.claim?.id
  }
}

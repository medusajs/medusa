import { DAL } from "@medusajs/types"
import {
  ClaimReason,
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
} from "@mikro-orm/core"
import Claim from "./claim"
import ClaimItemImage from "./claim-item-image"
import LineItem from "./line-item"

type OptionalLineItemProps = DAL.EntityDateColumns

const ClaimIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item",
  columns: "claim_id",
})

const ItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item",
  columns: "item_id",
})

@Entity({ tableName: "order_claim_item" })
export default class OrderClaimItem {
  [OptionalProps]?: OptionalLineItemProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @OneToMany(() => ClaimItemImage, (ci) => ci.item, {
    cascade: [Cascade.PERSIST, Cascade.REMOVE],
  })
  images = new Collection<ClaimItemImage>(this)

  @Enum({ items: () => ClaimReason })
  reason: ClaimReason

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
  claim: Claim

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
  item: LineItem

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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ordclaimitem")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ordclaimitem")
  }
}

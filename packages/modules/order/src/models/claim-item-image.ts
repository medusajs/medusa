import { DAL } from "@medusajs/types"
import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
  Rel,
} from "@mikro-orm/core"
import ClaimItem from "./claim-item"

type OptionalClaimItemImageProps = DAL.ModelDateColumns

const ClaimItemImageDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item_image",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

const ClaimItemIdIndex = createPsqlIndexStatementHelper({
  tableName: "order_claim_item_image",
  columns: ["claim_item_id"],
  where: "deleted_at IS NOT NULL",
})

@Entity({ tableName: "order_claim_item_image" })
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class ClaimItemImage {
  [OptionalProps]?: OptionalClaimItemImageProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @ManyToOne({
    entity: () => ClaimItem,
    mapToPk: true,
    fieldName: "claim_item_id",
    columnType: "text",
  })
  @ClaimItemIdIndex.MikroORMIndex()
  claim_item_id: string

  @ManyToOne(() => ClaimItem, {
    persist: false,
  })
  item: Rel<ClaimItem>

  @Property({ columnType: "text" })
  url: string

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
  @ClaimItemImageDeletedAtIndex.MikroORMIndex()
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "climg")
    this.claim_item_id = this.item?.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "climg")
    this.claim_item_id = this.item?.id
  }
}

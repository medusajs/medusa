import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Check,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  Property,
  Rel,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

const LineItemIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_adjustment_item_id",
  tableName: "cart_line_item_adjustment",
  columns: "item_id",
  where: "deleted_at IS NULL",
}).MikroORMIndex

const PromotionIdIndex = createPsqlIndexStatementHelper({
  name: "IDX_line_item_adjustment_promotion_id",
  tableName: "cart_line_item_adjustment",
  columns: "promotion_id",
  where: "deleted_at IS NULL AND promotion_id IS NOT NULL",
}).MikroORMIndex

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "cart_line_item_adjustment",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
}).MikroORMIndex

@Entity({ tableName: "cart_line_item_adjustment" })
@Check<LineItemAdjustment>({
  expression: (columns) => `${columns.amount} >= 0`,
})
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItemAdjustment extends AdjustmentLine {
  @ManyToOne({ entity: () => LineItem, persist: false })
  item: Rel<LineItem>

  @LineItemIdIndex()
  @ManyToOne({
    entity: () => LineItem,
    columnType: "text",
    fieldName: "item_id",
    mapToPk: true,
  })
  item_id: string

  @PromotionIdIndex()
  @Property({ columnType: "text", nullable: true })
  promotion_id: string | null = null

  @DeletedAtIndex()
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "caliadj")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "caliadj")
  }
}

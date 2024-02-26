import {
  DALUtils,
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Check,
  Entity,
  Filter,
  ManyToOne,
  OnInit,
  Property,
} from "@mikro-orm/core"
import AdjustmentLine from "./adjustment-line"
import LineItem from "./line-item"

@Entity({ tableName: "cart_line_item_adjustment" })
@Check<LineItemAdjustment>({
  expression: (columns) => `${columns.amount} >= 0`,
})
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class LineItemAdjustment extends AdjustmentLine {
  @ManyToOne({
    entity: () => LineItem,
    cascade: [Cascade.REMOVE, Cascade.PERSIST] as any,
  })
  item: LineItem

  @createPsqlIndexStatementHelper({
    name: "IDX_adjustment_item_id",
    tableName: "cart_line_item_adjustment",
    columns: "item_id",
    where: "deleted_at IS NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text" })
  item_id: string

  @createPsqlIndexStatementHelper({
    name: "IDX_line_item_adjustment_promotion_id",
    tableName: "cart_line_item_adjustment",
    columns: "promotion_id",
    where: "deleted_at IS NULL and promotion_id IS NOT NULL",
  }).MikroORMIndex()
  @Property({ columnType: "text", nullable: true })
  promotion_id: string | null = null

  @createPsqlIndexStatementHelper({
    tableName: "cart_line_item_adjustment",
    columns: "deleted_at",
    where: "deleted_at IS NOT NULL",
  }).MikroORMIndex()
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

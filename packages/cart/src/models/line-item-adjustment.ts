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
    index: "IDX_adjustment_item_id",
    cascade: [Cascade.REMOVE, Cascade.PERSIST],
  })
  item: LineItem

  @Property({ columnType: "text" })
  item_id: string

  @Property({
    columnType: "text",
    nullable: true,
    index: "IDX_line_item_adjustment_promotion_id"
  })
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

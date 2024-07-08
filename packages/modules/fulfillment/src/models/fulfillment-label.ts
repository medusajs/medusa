import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

import { DAL } from "@medusajs/types"
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
import Fulfillment from "./fulfillment"

type FulfillmentLabelOptionalProps = DAL.SoftDeletableModelDateColumns

const FulfillmentIdIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_label",
  columns: "fulfillment_id",
  where: "deleted_at IS NULL",
})

const DeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "fulfillment_label",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentLabel {
  [OptionalProps]?: FulfillmentLabelOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  tracking_number: string

  @Property({ columnType: "text" })
  tracking_url: string

  @Property({ columnType: "text" })
  label_url: string

  @ManyToOne(() => Fulfillment, {
    columnType: "text",
    mapToPk: true,
    fieldName: "fulfillment_id",
    onDelete: "cascade",
  })
  @FulfillmentIdIndex.MikroORMIndex()
  fulfillment_id: string

  @ManyToOne(() => Fulfillment, { persist: false })
  fulfillment: Rel<Fulfillment>

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
    this.id = generateEntityId(this.id, "fulla")
    this.fulfillment_id ??= this.fulfillment.id
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "fulla")
    this.fulfillment_id ??= this.fulfillment.id
  }
}

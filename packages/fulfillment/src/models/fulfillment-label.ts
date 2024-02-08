// TODO: Not to be reviewed yet. Waiting discussion before continuing this part

import {
  createPsqlIndexStatementHelper,
  DALUtils,
  generateEntityId,
} from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  ManyToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import Fulfillment from "./fulfillment"

type FulfillmentLabelOptionalProps = DAL.SoftDeletableEntityDateColumns

const fulfillmentIdIndexName = "IDX_fulfillment_label_fulfillment_id"
const fulfillmentIdIndexStatement = createPsqlIndexStatementHelper({
  name: fulfillmentIdIndexName,
  tableName: "fulfillment_label",
  columns: "fulfillment_id",
  where: "deleted_at IS NULL",
})

const providerIdIndexName = "IDX_fulfillment_label_provider_id"
const providerIdIndexStatement = createPsqlIndexStatementHelper({
  name: providerIdIndexName,
  tableName: "fulfillment_label",
  columns: "provider_id",
  where: "deleted_at IS NULL",
})

const deletedAtIndexName = "IDX_fulfillment_label_deleted_at"
const deletedAtIndexStatement = createPsqlIndexStatementHelper({
  name: deletedAtIndexName,
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

  @Property({ columnType: "text" })
  @Index({
    name: fulfillmentIdIndexName,
    expression: fulfillmentIdIndexStatement,
  })
  provider_id: string

  @Property({ columnType: "text" })
  @Index({
    name: providerIdIndexName,
    expression: providerIdIndexStatement,
  })
  fulfillment_id: string

  @ManyToOne(() => Fulfillment)
  fulfillment: Fulfillment

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
  @Index({
    name: deletedAtIndexName,
    expression: deletedAtIndexStatement,
  })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "fulla")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "fulla")
  }
}

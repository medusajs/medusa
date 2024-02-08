// TODO: Not to be reviewed yet. Waiting discussion before continuing this part

import { DALUtils, generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  OneToOne,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"
import Fulfillment from "./fulfillment"

type FulfillmentItemOptionalProps = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentItem {
  [OptionalProps]?: FulfillmentItemOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  title: string

  @Property({ columnType: "text" })
  sku: string

  @Property({ columnType: "text" })
  barcode: string

  @Property({ columnType: "numeric", serializer: Number })
  quantity: number // TODO: probably allow big numbers here

  @Property({ columnType: "text", nullable: true })
  line_item_id: string | null = null

  @Property({ columnType: "text", nullable: true })
  inventory_item_id: string | null = null

  @Property({ columnType: "text" })
  fulfillment_id: string

  @OneToOne(() => Fulfillment, "items")
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

  @Index({ name: "IDX_fulfillment_item_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "fulit")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "fulit")
  }
}

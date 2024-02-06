// TODO: Not to be reviewed yet. Waiting discussion before continuing this part

import { DALUtils, generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  Filter,
  Index,
  OnInit,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { DAL } from "@medusajs/types"

type FulfillmentLabelOptionalProps = DAL.SoftDeletableEntityDateColumns

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class FulfillmentLabel {
  [OptionalProps]?: FulfillmentLabelOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

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

  @Index({ name: "IDX_fulfillment_label_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
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

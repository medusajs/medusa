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

type FulfillmentOptionalProps = DAL.EntityDateColumns

// TODO: Waiting discussion before continuing this part

@Entity()
@Filter(DALUtils.mikroOrmSoftDeletableFilterOptions)
export default class Fulfillment {
  [OptionalProps]?: FulfillmentOptionalProps

  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  location_id: string

  @Property({ columnType: "jsonb", nullable: true })
  tracking_numbers: string[] | null = null

  @Property({
    columnType: "timestamptz",
  })
  packed_at: Date | null = null

  @Property({
    columnType: "timestamptz",
  })
  shipped_at: Date | null = null

  @Property({
    columnType: "timestamptz",
  })
  delivered_at: Date | null = null

  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null = null

  @Property({ columnType: "text" })
  provider_id: string

  @Property({ columnType: "text", nullable: true })
  shipping_option_id: string | null = null

  shipping_option // TODO configure relationship
  provider // TODO  configure relationship
  shipping_labels // TODO configure relationship
  items // TODO configure relationship
  delivery_address // TODO configure relationship

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

  @Index({ name: "IDX_fulfillment_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "ful")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "ful")
  }
}

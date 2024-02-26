import { generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity()
export default class Store {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "store")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "store")
  }
}

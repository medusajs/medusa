import { generateEntityId } from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

// TODO:
@Entity()
export default class ApiKey {
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

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "apk")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "apk")
  }
}

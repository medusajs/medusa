import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"


@Entity()
export default class User {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "user")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "user")
  }
}

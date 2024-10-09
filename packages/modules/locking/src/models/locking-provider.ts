import { Searchable, generateEntityId } from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity({ tableName: "locking_provider" })
export default class LockingProvider {
  @Searchable()
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "boolean", defaultRaw: "true" })
  is_enabled: boolean = true

  @Property({ columnType: "boolean", defaultRaw: "false" })
  is_default: boolean = false

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "lkpro")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "lkpro")
  }
}

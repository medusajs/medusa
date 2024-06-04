import { generateEntityId, Searchable } from "@medusajs/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity()
export default class FulfillmentProvider {
  @Searchable()
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "boolean", defaultRaw: "true" })
  is_enabled: boolean = true

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "serpro")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "serpro")
  }
}

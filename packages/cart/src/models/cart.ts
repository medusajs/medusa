import { generateEntityId } from "@medusajs/utils"
import { BeforeCreate, Entity, OnInit, PrimaryKey } from "@mikro-orm/core"

@Entity()
export default class Cart {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "cart")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "cart")
  }
}

import { generateEntityId } from "@medusajs/utils"
import { BeforeCreate, Entity, PrimaryKey, OnInit } from "@mikro-orm/core"

@Entity()
export default class Promotion {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "promo")
  }
  
  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "promo")
  }
}

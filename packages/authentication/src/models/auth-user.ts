import { generateEntityId } from "@medusajs/utils"
import { BeforeCreate, Entity, OnInit, PrimaryKey } from "@mikro-orm/core"

@Entity()
export default class AuthUser {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "authusr")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "authusr")
  }
}

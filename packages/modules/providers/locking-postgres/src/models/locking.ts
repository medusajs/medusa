import { generateEntityId } from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

@Entity({ tableName: "locking" })
class Locking {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  owner_id: string | null = null

  @Property({ columnType: "timestamptz", nullable: true })
  expiration: Date | null = null

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "lk")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "lk")
  }
}

export default Locking

import { generateEntityId } from "@medusajs/utils"
import {
  ArrayType,
  BeforeCreate,
  Collection,
  Entity,
  OnInit,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import Notification from "./notification"

@Entity()
export default class NotificationProvider {
  @PrimaryKey({ columnType: "text" })
  id: string

  @Property({ columnType: "text" })
  handle: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "boolean", defaultRaw: "true" })
  is_enabled: boolean = true

  @Property({ type: ArrayType })
  channels: string[]

  @OneToMany({
    entity: () => Notification,
    mappedBy: (notification) => notification.provider_id,
  })
  notifications = new Collection<Notification>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "notpro")
  }

  @OnInit()
  onInit() {
    this.id = generateEntityId(this.id, "notpro")
  }
}

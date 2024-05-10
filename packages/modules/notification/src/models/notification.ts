import {
  createPsqlIndexStatementHelper,
  generateEntityId,
} from "@medusajs/utils"

import {
  BeforeCreate,
  Entity,
  ManyToOne,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import NotificationProvider from "./notification-provider"

const NotificationProviderIdIndex = createPsqlIndexStatementHelper({
  tableName: "notification",
  columns: "provider_id",
})

const NotificationIdempotencyKeyIndex = createPsqlIndexStatementHelper({
  tableName: "notification",
  columns: "idempotency_key",
})

const NotificationReceiverIdIndex = createPsqlIndexStatementHelper({
  tableName: "notification",
  columns: "receiver_id",
})

// We don't need to support soft deletes here as this information is mainly used for auditing purposes.
// Instead, we probably want to have a TTL for each entry, so we don't bloat the DB (and also for GDPR reasons if TTL < 30 days).
@NotificationProviderIdIndex.MikroORMIndex()
@NotificationIdempotencyKeyIndex.MikroORMIndex()
@NotificationReceiverIdIndex.MikroORMIndex()
@Entity({ tableName: "notification" })
// Since there is a native `Notification` type, we have to call this something else here and in a couple of other places.
export default class NotificationModel {
  @PrimaryKey({ columnType: "text" })
  id: string

  // This can be an email, phone number, or username, depending on the channel.
  @Property({ columnType: "text" })
  to: string

  @Property({ columnType: "text" })
  channel: string

  // The template name in the provider's system.
  @Property({ columnType: "text" })
  template: string

  // The data that gets passed over to the provider for rendering the notification.
  @Property({ columnType: "jsonb", nullable: true })
  data: Record<string, unknown> | null

  // This can be the event name, the workflow, or anything else that can help to identify what triggered the notification.
  @Property({ columnType: "text", nullable: true })
  trigger_type?: string | null

  // The ID of the resource this notification is for, if applicable. Useful for displaying relevant information in the UI
  @Property({ columnType: "text", nullable: true })
  resource_id?: string | null

  // The typeame of the resource this notification is for, if applicable, eg. "order"
  @Property({ columnType: "text", nullable: true })
  resource_type?: string | null

  // The ID of the receiver of the notification, if applicable. This can be a customer, user, a company, or anything else.
  @Property({ columnType: "text", nullable: true })
  receiver_id?: string | null

  // The original notification, in case this is a retried notification.
  @Property({ columnType: "text", nullable: true })
  original_notification_id?: string | null

  @Property({ columnType: "text", nullable: true })
  idempotency_key?: string | null

  // The ID of the notification in the external system, if applicable
  @Property({ columnType: "text", nullable: true })
  external_id?: string | null

  @ManyToOne(() => NotificationProvider, {
    columnType: "text",
    fieldName: "provider_id",
    mapToPk: true,
    nullable: true,
    onDelete: "set null",
  })
  provider_id: string

  @ManyToOne(() => NotificationProvider, { persist: false })
  provider: NotificationProvider

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date

  @BeforeCreate()
  @OnInit()
  onCreate() {
    this.id = generateEntityId(this.id, "not")
    this.provider_id ??= this.provider_id ?? this.provider?.id
  }
}

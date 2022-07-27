import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"
import { BaseEntity } from "../interfaces/models/base-entity"
import { DbAwareColumn } from "../utils/db-aware-column"

import { Customer } from "./customer"
import { NotificationProvider } from "./notification-provider"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Notification extends BaseEntity {
  @Column({ nullable: true })
  event_name: string

  @Index()
  @Column()
  resource_type: string

  @Index()
  @Column()
  resource_id: string

  @Index()
  @Column({ nullable: true })
  customer_id: string | null

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column()
  to: string

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @Column({ nullable: true })
  parent_id: string

  @ManyToOne(() => Notification)
  @JoinColumn({ name: "parent_id" })
  parent_notification: Notification

  @OneToMany(() => Notification, (noti) => noti.parent_notification)
  resends: Notification[]

  @Column({ nullable: true })
  provider_id: string

  @ManyToOne(() => NotificationProvider)
  @JoinColumn({ name: "provider_id" })
  provider: NotificationProvider

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "noti")
  }
}

/**
 * @schema notification
 * title: "Notification"
 * description: "Notifications a communications sent via Notification Providers as a reaction to internal events such as `order.placed`. Notifications can be used to show a chronological timeline for communications sent to a Customer regarding an Order, and enables resends."
 * x-resourceId: notification
 * properties:
 *   id:
 *     description: "The id of the Notification. This value will be prefixed by `noti_`."
 *     type: string
 *   event_name:
 *     description: "The name of the event that the notification was sent for."
 *     type: string
 *   resource_type:
 *     description: "The type of resource that the Notification refers to."
 *     type: string
 *   resource_id:
 *     description: "The id of the resource that the Notification refers to."
 *     type: string
 *   customer_id:
 *     description: "The id of the Customer that the Notification was sent to."
 *     type: string
 *   customer:
 *     description: "The Customer that the Notification was sent to."
 *     anyOf:
 *       - $ref: "#/components/schemas/customer"
 *   to:
 *     description: "The address that the Notification was sent to. This will usually be an email address, but represent other addresses such as a chat bot user id"
 *     type: string
 *   data:
 *     description: "The data that the Notification was sent with. This contains all the data necessary for the Notification Provider to initiate a resend."
 *     type: object
 *   parent_id:
 *     description: "The id of the Notification that was originally sent."
 *     type: string
 *   resends:
 *     description: "The resends that have been completed after the original Notification."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/notification_resend"
 *   provider_id:
 *     description: "The id of the Notification Provider that handles the Notification."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 */

/**
 * @schema notification_resend
 * title: "Notification Resend"
 * description: "A resend of a Notification."
 * x-resourceId: notification_resend
 * properties:
 *   id:
 *     description: "The id of the Notification. This value will be prefixed by `noti_`."
 *     type: string
 *   event_name:
 *     description: "The name of the event that the notification was sent for."
 *     type: string
 *   resource_type:
 *     description: "The type of resource that the Notification refers to."
 *     type: string
 *   resource_id:
 *     description: "The id of the resource that the Notification refers to."
 *     type: string
 *   to:
 *     description: "The address that the Notification was sent to. This will usually be an email address, but represent other addresses such as a chat bot user id"
 *     type: string
 *   data:
 *     description: "The data that the Notification was sent with. This contains all the data necessary for the Notification Provider to initiate a resend."
 *     type: object
 *   parent_id:
 *     description: "The id of the Notification that was originally sent."
 *     type: string
 *   provider_id:
 *     description: "The id of the Notification Provider that handles the Notification."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 */

import {
  Entity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { Customer } from "./customer"
import { NotificationProvider } from "./notification-provider"

@Entity()
export class Notification {
  @PrimaryColumn()
  id: string

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
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column()
  to: string

  @Column({ type: "jsonb" })
  data: any

  @Column({ nullable: true })
  parent_id: string

  @ManyToOne(() => Notification)
  @JoinColumn({ name: "parent_id" })
  parent_notification: Notification

  @OneToMany(
    () => Notification,
    noti => noti.parent_notification
  )
  resends: Notification[]

  @Column({ nullable: true })
  provider_id: string

  @ManyToOne(() => NotificationProvider)
  @JoinColumn({ name: "provider_id" })
  provider: NotificationProvider

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `noti_${id}`
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

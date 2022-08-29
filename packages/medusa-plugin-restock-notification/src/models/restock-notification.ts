import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ProductVariant } from "@medusajs/medusa"

@Entity()
export class RestockNotification {
  @PrimaryColumn()
  variant_id: string

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

  @Column({ type: "jsonb" })
  emails: string[]

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date
}

/**
 * @schema restock_notification
 * title: "Restock Notification"
 * description: "Holds a list of emails that wish to be notifed when an item is restocked."
 * x-resourceId: restock_notification
 * properties:
 *   variant_id:
 *     type: string
 *     description: "The id of the variant that customers have signed up to be notified about,"
 *   emails:
 *     description: "The emails of customers who wish to be notified about restocks."
 *     type: array
 *     items:
 *       type: string
 *   created_at:
 *     type: string
 *     format: date-time
 *     description: "The date time at which the first restock signup was made."
 *   updated_at:
 *     type: string
 *     format: date-time
 *     description: "The date time at which the first last signup was made."
 */

import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { Region } from "./region"
import { Order } from "./order"

@Entity()
export class GiftCard {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  code: string

  @Column("int")
  value: number

  @Column("int")
  balance: number

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @Index()
  @Column({ nullable: true })
  order_id: string

  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column({ default: false })
  is_disabled: boolean

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  ends_at: Date

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `gift_${id}`
  }
}

/**
 * @schema gift_card
 * title: "Gift Card"
 * description: "Gift Cards are redeemable and represent a value that can be used towards the payment of an Order."
 * x-resourceId: gift_card
 * properties:
 *   id:
 *     description: "The id of the Gift Card. This value will be prefixed by `gift_`."
 *     type: string
 *   code:
 *     description: "The unique code that identifies the Gift Card. This is used by the Customer to redeem the value of the Gift Card."
 *     type: string
 *   value:
 *     description: "The value that the Gift Card represents."
 *     type: integer
 *   balance:
 *     description: "The remaining value on the Gift Card."
 *     type: integer
 *   region_id:
 *     description: "The id of the Region in which the Gift Card is available."
 *     type: string
 *   region:
 *     description: "The Region in which the Gift Card is available."
 *     anyOf:
 *       - $ref: "#/components/schemas/region"
 *   order_id:
 *     description: "The id of the Order that the Gift Card was purchased in."
 *     type: string
 *   is_disabled:
 *     description: "Whether the Gift Card has been disabled. Disabled Gift Cards cannot be applied to carts."
 *     type: boolean
 *   ends_at:
 *     description: "The time at which the Gift Card can no longer be used."
 *     type: string
 *     format: date-time
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */

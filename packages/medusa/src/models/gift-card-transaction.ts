import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from "typeorm"
import { resolveDbType } from "../utils/db-aware-column"

import { GiftCard } from "./gift-card"
import { Order } from "./order"
import { generateEntityId } from "../utils/generate-entity-id"

@Unique("gcuniq", ["gift_card_id", "order_id"])
@Entity()
export class GiftCardTransaction {
  @PrimaryColumn()
  id: string

  @Column()
  gift_card_id: string

  @ManyToOne(() => GiftCard)
  @JoinColumn({ name: "gift_card_id" })
  gift_card: GiftCard

  @Index()
  @Column()
  order_id: string

  @ManyToOne(() => Order)
  @JoinColumn({ name: "order_id" })
  order: Order

  @Column("int")
  amount: number

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "gct")
  }
}

/**
 * @schema gift_card_transaction
 * title: "Gift Card Transaction"
 * description: "Gift Card Transactions are created once a Customer uses a Gift Card to pay for their Order"
 * x-resourceId: gift_card_transaction
 * properties:
 *   id:
 *     description: "The id of the Gift Card Transaction. This value will be prefixed by `gct_`."
 *     type: string
 *   gift_card_id:
 *     description: "The id of the Gift Card that was used in the transaction."
 *     type: string
 *   gift_card:
 *     description: "The Gift Card that was used in the transaction."
 *     anyOf:
 *       - $ref: "#/components/schemas/gift_card"
 *   order_id:
 *     description: "The id of the Order that the Gift Card was used to pay for."
 *     type: string
 *   amount:
 *     description: "The amount that was used from the Gift Card."
 *     type: integer
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 */

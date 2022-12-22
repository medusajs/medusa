import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm"

import { Cart } from "./cart"
import { DbAwareColumn } from "../utils/db-aware-column"
import { ShippingOption } from "./shipping-option"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
@Unique(["shipping_option_id", "cart_id"])
export class CustomShippingOption extends SoftDeletableEntity {
  @Column({ type: "int" })
  price: number

  @Index()
  @Column()
  shipping_option_id: string

  @ManyToOne(() => ShippingOption)
  @JoinColumn({ name: "shipping_option_id" })
  shipping_option: ShippingOption

  @Index()
  @Column({ nullable: true })
  cart_id: string

  @ManyToOne(() => Cart)
  @JoinColumn({ name: "cart_id" })
  cart: Cart

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "cso")
  }
}

/**
 * @schema CustomShippingOption
 * title: "Custom Shipping Option"
 * description: "Custom Shipping Options are 'overriden' Shipping Options. Store managers can attach a Custom Shipping Option to a cart in order to set a custom price for a particular Shipping Option"
 * type: object
 * required:
 *   - price
 *   - shipping_option_id
 * properties:
 *   id:
 *     type: string
 *     description: The custom shipping option's ID
 *     example: cso_01G8X99XNB77DMFBJFWX6DN9V9
 *   price:
 *     description: "The custom price set that will override the shipping option's original price"
 *     type: integer
 *     example: 1000
 *   shipping_option_id:
 *     description: "The ID of the Shipping Option that the custom shipping option overrides"
 *     type: string
 *     example: so_01G1G5V27GYX4QXNARRQCW1N8T
 *   shipping_option:
 *     description: A shipping option object. Available if the relation `shipping_option` is expanded.
 *     type: object
 *   cart_id:
 *     description: "The ID of the Cart that the custom shipping option is attached to"
 *     type: string
 *     example: cart_01G8ZH853Y6TFXWPG5EYE81X63
 *   cart:
 *     description: A cart object. Available if the relation `cart` is expanded.
 *     type: object
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 *   includes_tax:
 *     description: "[EXPERIMENTAL] Indicates if the custom shipping option price include tax"
 *     type: boolean
 */

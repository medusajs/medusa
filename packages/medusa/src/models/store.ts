import {
  Entity,
  RelationId,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { Currency } from "./currency"

@Entity()
export class Store {
  @PrimaryColumn()
  id: string

  @Column({ default: "Medusa Store" })
  name: string

  @Column({ default: "usd" })
  default_currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "default_currency_code", referencedColumnName: "code" })
  default_currency: Currency

  @ManyToMany(() => Currency)
  @JoinTable({
    name: "store_currencies",
    joinColumn: {
      name: "store_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "currency_code",
      referencedColumnName: "code",
    },
  })
  currencies: Currency[]

  @Column({ nullable: true })
  swap_link_template: string

  @Column({ nullable: true })
  payment_link_template: string

  @Column({ nullable: true })
  invite_link_template: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = ulid()
    this.id = `store_${id}`
  }
}

/**
 * @schema store
 * title: "Store"
 * description: "Holds settings for the Store, such as name, currencies, etc."
 * x-resourceId: store
 * properties:
 *   id:
 *     description: "The id of the Store. This value will be prefixed with `store_`."
 *     type: string
 *   name:
 *     description: "The name of the Store - this may be displayed to the Customer."
 *     type: string
 *   default_currency_code:
 *     description: "The default currency code used when no other currency code is specified."
 *     type: string
 *   currencies:
 *     description: "The currencies that are enabled for the Store."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/currency"
 *   swap_link_template:
 *     description: "A template to generate Swap links from use {{cart_id}} to include the Swap's `cart_id` in the link."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */

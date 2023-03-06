import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"

import { Currency, Payment, PaymentSession, Region } from "."
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils"
import { DbAwareColumn } from "../utils/db-aware-column"

export enum PaymentCollectionStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  AUTHORIZED = "authorized",
  PARTIALLY_AUTHORIZED = "partially_authorized",
  CANCELED = "canceled",
}

export enum PaymentCollectionType {
  ORDER_EDIT = "order_edit",
}

@Entity()
export class PaymentCollection extends SoftDeletableEntity {
  @DbAwareColumn({ type: "enum", enum: PaymentCollectionType })
  type: PaymentCollectionType

  @DbAwareColumn({ type: "enum", enum: PaymentCollectionStatus })
  status: PaymentCollectionStatus

  @Column({ type: "varchar", nullable: true })
  description: string | null

  @Column({ type: "int" })
  amount: number

  @Column({ type: "int", nullable: true })
  authorized_amount: number | null

  @Index()
  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @Index()
  @Column()
  currency_code: string

  @ManyToOne(() => Currency)
  @JoinColumn({ name: "currency_code", referencedColumnName: "code" })
  currency: Currency

  @ManyToMany(() => PaymentSession)
  @JoinTable({
    name: "payment_collection_sessions",
    joinColumn: {
      name: "payment_collection_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "payment_session_id",
      referencedColumnName: "id",
    },
  })
  payment_sessions: PaymentSession[]

  @ManyToMany(() => Payment)
  @JoinTable({
    name: "payment_collection_payments",
    joinColumn: {
      name: "payment_collection_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "payment_id",
      referencedColumnName: "id",
    },
  })
  payments: Payment[]

  @DbAwareColumn({ type: "jsonb" })
  metadata: Record<string, unknown>

  @Column()
  created_by: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "paycol")
  }
}

/**
 * @schema PaymentCollection
 * title: "Payment Collection"
 * description: "Payment Collection"
 * type: object
 * required:
 *   - amount
 *   - authorized_amount
 *   - created_at
 *   - created_by
 *   - currency_code
 *   - deleted_at
 *   - description
 *   - id
 *   - metadata
 *   - region_id
 *   - status
 *   - type
 *   - updated_at
 * properties:
 *   id:
 *     description: The payment collection's ID
 *     type: string
 *     example: paycol_01G8TJSYT9M6AVS5N4EMNFS1EK
 *   type:
 *     description: The type of the payment collection
 *     type: string
 *     enum:
 *       - order_edit
 *   status:
 *     description: The type of the payment collection
 *     type: string
 *     enum:
 *       - not_paid
 *       - awaiting
 *       - authorized
 *       - partially_authorized
 *       - canceled
 *   description:
 *     description: Description of the payment collection
 *     nullable: true
 *     type: string
 *   amount:
 *     description: Amount of the payment collection.
 *     type: integer
 *   authorized_amount:
 *     description: Authorized amount of the payment collection.
 *     nullable: true
 *     type: integer
 *   region_id:
 *     description: The region's ID
 *     type: string
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: Available if the relation `region` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   currency_code:
 *     description: The 3 character ISO code for the currency.
 *     type: string
 *     example: usd
 *     externalDocs:
 *       url: https://en.wikipedia.org/wiki/ISO_4217#Active_codes
 *       description: See a list of codes.
 *   currency:
 *     description: Available if the relation `currency` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Currency"
 *   payment_sessions:
 *     description: Available if the relation `payment_sessions` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/PaymentSession"
 *   payments:
 *     description: Available if the relation `payments` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Payment"
 *   created_by:
 *     description: The ID of the user that created the payment collection.
 *     type: string
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */

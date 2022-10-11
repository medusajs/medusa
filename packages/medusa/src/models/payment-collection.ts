import {
  BeforeInsert,
  Column,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils"
import { Currency, Payment, PaymentSession, Region } from "."

import OrderEditingFeatureFlag from "../loaders/feature-flags/order-editing"
import { FeatureFlagEntity } from "../utils/feature-flag-decorators"

export enum PaymentCollectionStatus {
  NOT_PAID = "not_paid",
  AWAITING = "awaiting",
  AUTHORIZED = "authorized",
  PARTIALLY_AUTHORIZED = "partially_authorized",
  CAPTURED = "captured",
  PARTIALLY_CAPTURED = "partially_captured",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  CANCELED = "canceled",
  REQUIRES_ACTION = "requires_action",
}

export enum PaymentCollectionType {
  ORDER_EDIT = "order_edit",
}

@FeatureFlagEntity(OrderEditingFeatureFlag.key)
export class PaymentCollection extends SoftDeletableEntity {
  @DbAwareColumn({ type: "enum", enum: PaymentCollectionType })
  type: PaymentCollectionType

  @DbAwareColumn({ type: "enum", enum: PaymentCollectionStatus })
  status: PaymentCollectionStatus

  @Column({ nullable: true })
  description: string

  @Column({ type: "int" })
  amount: number

  @Column({ type: "int", nullable: true })
  authorized_amount: number

  @Column({ type: "int", nullable: true })
  refunded_amount: number

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

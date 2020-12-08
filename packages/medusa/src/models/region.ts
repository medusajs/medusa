import {
  Entity,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { PaymentProvider } from "./payment-provider"
import { FulfillmentProvider } from "./fulfillment-provider"

@Entity()
export class Region {
  @PrimaryColumn()
  id: string

  @Column()
  currency_code: string

  @Column({ type: "int" })
  tax_rate: number

  @Column({ nullable: true })
  tax_code: string

  @Column({ type: "jsonb" })
  countries: string[]

  @ManyToMany(() => PaymentProvider)
  @JoinTable({
    name: "region_payment_providers",
    joinColumn: {
      name: "region_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "provider_id",
      referencedColumnName: "id",
    },
  })
  payment_providers: PaymentProvider[]

  @ManyToMany(() => FulfillmentProvider)
  @JoinTable({
    name: "region_fulfillment_providers",
    joinColumn: {
      name: "region_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "provider_id",
      referencedColumnName: "id",
    },
  })
  fulfillment_providers: FulfillmentProvider[]

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 24)
    this.id = `reg_${id}`
  }
}

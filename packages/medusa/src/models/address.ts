import {
  Entity,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { Customer } from "./customer"

@Entity()
export class Address {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  customer_id: string

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  address_1: string

  @Column()
  address_2: string

  @Column()
  city: string

  @Column()
  country_code: string

  @Column()
  province: string

  @Column()
  postal_code: string

  @Column()
  phone: string

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
    const id = randomize("Aa0", 10)
    this.id = `addr_${id}`
  }
}

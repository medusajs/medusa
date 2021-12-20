/**
 * @schema address
 * title: "Address"
 * description: "An address."
 * x-resourceId: address
 * properties:
 *  id:
 *    type: string
 *  customer_id:
 *    type: string
 *  company:
 *    type: string
 *  first_name:
 *    type: string
 *  last_name:
 *    type: string
 *  address_1:
 *    type: string
 *  address_2:
 *    type: string
 *  city:
 *    type: string
 *  country_code:
 *    type: string
 *  country:
 *    $ref: "#/components/schemas/country"
 */

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
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

import { Customer } from "./customer"
import { Country } from "./country"

@Entity()
export class Address {
  @PrimaryColumn()
  id: string

  @Index()
  @Column({ type: "varchar", nullable: true })
  customer_id: string | null

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customer_id" })
  customer: Customer | null

  @Column({ type: "varchar", nullable: true })
  company: string | null

  @Column({ type: "varchar", nullable: true })
  first_name: string | null

  @Column({ type: "varchar", nullable: true })
  last_name: string | null

  @Column({ type: "varchar", nullable: true })
  address_1: string | null

  @Column({ type: "varchar", nullable: true })
  address_2: string | null

  @Column({ type: "varchar", nullable: true })
  city: string | null

  @Column({ type: "varchar", nullable: true })
  country_code: string | null

  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_code", referencedColumnName: "iso_2" })
  country: Country | null

  @Column({ type: "varchar", nullable: true })
  province: string | null

  @Column({ type: "varchar", nullable: true })
  postal_code: string | null

  @Column({ type: "varchar", nullable: true })
  phone: string | null

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DeleteDateColumn({ type: resolveDbType("timestamptz") })
  deleted_at: Date | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `addr_${id}`
  }
}

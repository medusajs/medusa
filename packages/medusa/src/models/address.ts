import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"

import { Country } from "./country"
import { Customer } from "./customer"
import { DbAwareColumn } from "../utils/db-aware-column"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class Address extends SoftDeletableEntity {
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

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "addr")
  }
}

/**
 * @schema address_fields
 * title: "Address Fields"
 * description: "Address fields used when creating/updating an address."
 * x-resourceId: address
 * properties:
 *  company:
 *    type: string
 *    description: Company name
 *    example: Acme
 *  first_name:
 *    type: string
 *    description: First name
 *    example: Arno
 *  last_name:
 *    type: string
 *    description: Last name
 *    example: Willms
 *  address_1:
 *    type: string
 *    description: Address line 1
 *    example: 14433 Kemmer Court
 *  address_2:
 *    type: string
 *    description: Address line 2
 *    example: Suite 369
 *  city:
 *    type: string
 *    description: City
 *    example: South Geoffreyview
 *  country_code:
 *    type: string
 *    description: The 2 character ISO code of the country in lower case
 *    externalDocs:
 *      url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *      description: See a list of codes.
 *    example: st
 *  province:
 *    type: string
 *    description: Province
 *    example: Kentucky
 *  postal_code:
 *    type: string
 *    description: Postal Code
 *    example: 72093
 *  phone:
 *    type: string
 *    description: Phone Number
 *    example: 16128234334802
 *  metadata:
 *    type: object
 *    description: An optional key-value map with additional details
 *    example: {car: "white"}
 */

/**
 * @schema address
 * title: "Address"
 * description: "An address."
 * x-resourceId: address
 * properties:
 *  id:
 *    type: string
 *    description: ID of the address
 *    example: addr_01G8ZC9VS1XVE149MGH2J7QSSH
 *  customer_id:
 *    type: string
 *    description: ID of the customer this address belongs to
 *    example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *  customer:
 *    description: Available if the relation `customer` is expanded.
 *    type: array
 *    items:
 *      type: object
 *      description: A customer object.
 *  company:
 *    type: string
 *    description: Company name
 *    example: Acme
 *  first_name:
 *    type: string
 *    description: First name
 *    example: Arno
 *  last_name:
 *    type: string
 *    description: Last name
 *    example: Willms
 *  address_1:
 *    type: string
 *    description: Address line 1
 *    example: 14433 Kemmer Court
 *  address_2:
 *    type: string
 *    description: Address line 2
 *    example: Suite 369
 *  city:
 *    type: string
 *    description: City
 *    example: South Geoffreyview
 *  country_code:
 *    type: string
 *    description: The 2 character ISO code of the country in lower case
 *    externalDocs:
 *      url: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
 *      description: See a list of codes.
 *    example: st
 *  country:
 *    description: A country object. Available if the relation `country` is expanded.
 *    type: object
 *  province:
 *    type: string
 *    description: Province
 *    example: Kentucky
 *  postal_code:
 *    type: string
 *    description: Postal Code
 *    example: 72093
 *  phone:
 *    type: string
 *    description: Phone Number
 *    example: 16128234334802
 *  created_at:
 *    type: string
 *    description: "The date with timezone at which the resource was created."
 *    format: date-time
 *  updated_at:
 *    type: string
 *    description: "The date with timezone at which the resource was updated."
 *    format: date-time
 *  deleted_at:
 *    type: string
 *    description: "The date with timezone at which the resource was deleted."
 *    format: date-time
 *  metadata:
 *    type: object
 *    description: An optional key-value map with additional details
 *    example: {car: "white"}
 */
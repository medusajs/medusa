import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"

import { BaseEntity } from "../interfaces/models/base-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { Product } from "./product"
import { ProductType } from "./product-type"
import { Region } from "./region"
import { ShippingOption } from "./shipping-option"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class TaxRate extends BaseEntity {
  @Column({ type: "real", nullable: true })
  rate: number | null

  @Column({ type: "varchar", nullable: true })
  code: string | null

  @Column()
  name: string

  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region?: Region | null

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @ManyToMany(() => Product)
  @JoinTable({
    name: "product_tax_rate",
    joinColumn: {
      name: "rate_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products?: Product[]

  @ManyToMany(() => ProductType)
  @JoinTable({
    name: "product_type_tax_rate",
    joinColumn: {
      name: "rate_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_type_id",
      referencedColumnName: "id",
    },
  })
  product_types?: ProductType[]

  @ManyToMany(() => ShippingOption)
  @JoinTable({
    name: "shipping_tax_rate",
    joinColumn: {
      name: "rate_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "shipping_option_id",
      referencedColumnName: "id",
    },
  })
  shipping_options?: ShippingOption[]

  // TODO: consider custom DTO instead
  product_count?: number
  product_type_count?: number
  shipping_option_count?: number

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "txr")
  }
}

/**
 * @schema TaxRate
 * title: "Tax Rate"
 * description: "A Tax Rate can be used to associate a certain rate to charge on products within a given Region"
 * type: object
 * required:
 *   - name
 *   - region_id
 * properties:
 *   id:
 *     type: string
 *     description: The tax rate's ID
 *     example: txr_01G8XDBAWKBHHJRKH0AV02KXBR
 *   rate:
 *     description: "The numeric rate to charge"
 *     type: number
 *     example: 10
 *   code:
 *     description: "A code to identify the tax type by"
 *     type: string
 *     example: tax01
 *   name:
 *     description: "A human friendly name for the tax"
 *     type: string
 *     example: Tax Example
 *   region_id:
 *     type: string
 *     description: "The id of the Region that the rate belongs to"
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: A region object. Available if the relation `region` is expanded.
 *     type: object
 *   products:
 *     type: array
 *     description: The products that belong to this tax rate. Available if the relation `products` is expanded.
 *     items:
 *       type: object
 *       description: A product object.
 *   product_types:
 *     type: array
 *     description: The product types that belong to this tax rate. Available if the relation `product_types` is expanded.
 *     items:
 *       type: object
 *       description: A product type object.
 *   shipping_options:
 *     type: array
 *     description: The shipping options that belong to this tax rate. Available if the relation `shipping_options` is expanded.
 *     items:
 *       type: object
 *       description: A shipping option object.
 *   product_count:
 *     description: "The count of products"
 *     type: integer
 *     example: null
 *   product_type_count:
 *     description: "The count of product types"
 *     type: integer
 *     example: null
 *   shipping_option_count:
 *     description: "The count of shipping options"
 *     type: integer
 *     example: null
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */

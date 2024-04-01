import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
} from "typeorm"

import { BaseEntity } from "../interfaces/models/base-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"
import { Product } from "./product"
import { ProductType } from "./product-type"
import { Region } from "./region"
import { ShippingOption } from "./shipping-option"

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

  @ManyToOne(() => Region, (region) => region.tax_rates)
  @JoinColumn({ name: "region_id" })
  region: Relation<Region>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

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
  products: Relation<Product>[]

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
  product_types: Relation<ProductType>[]

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
  shipping_options: Relation<ShippingOption>[]

  // TODO: consider custom DTO instead
  product_count?: number
  product_type_count?: number
  shipping_option_count?: number

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "txr")
  }
}

/**
 * @schema TaxRate
 * title: "Tax Rate"
 * description: "A Tax Rate can be used to define a custom rate to charge on specified products, product types, and shipping options within a given region."
 * type: object
 * required:
 *   - code
 *   - created_at
 *   - id
 *   - metadata
 *   - name
 *   - rate
 *   - region_id
 *   - updated_at
 * properties:
 *   id:
 *     description: The tax rate's ID
 *     type: string
 *     example: txr_01G8XDBAWKBHHJRKH0AV02KXBR
 *   rate:
 *     description: The numeric rate to charge
 *     nullable: true
 *     type: number
 *     example: 10
 *   code:
 *     description: A code to identify the tax type by
 *     nullable: true
 *     type: string
 *     example: tax01
 *   name:
 *     description: A human friendly name for the tax
 *     type: string
 *     example: Tax Example
 *   region_id:
 *     description: The ID of the region that the rate belongs to.
 *     type: string
 *     example: reg_01G1G5V26T9H8Y0M4JNE3YGA4G
 *   region:
 *     description: The details of the region that the rate belongs to.
 *     x-expandable: "region"
 *     nullable: true
 *     $ref: "#/components/schemas/Region"
 *   products:
 *     description: The details of the products that belong to this tax rate.
 *     type: array
 *     x-expandable: "products"
 *     items:
 *       $ref: "#/components/schemas/Product"
 *   product_types:
 *     description: The details of the product types that belong to this tax rate.
 *     type: array
 *     x-expandable: "product_types"
 *     items:
 *       $ref: "#/components/schemas/ProductType"
 *   shipping_options:
 *     description: The details of the shipping options that belong to this tax rate.
 *     type: array
 *     x-expandable: "shipping_options"
 *     items:
 *       $ref: "#/components/schemas/ShippingOption"
 *   product_count:
 *     description: The count of products
 *     type: integer
 *     example: 10
 *   product_type_count:
 *     description: The count of product types
 *     type: integer
 *     example: 2
 *   shipping_option_count:
 *     description: The count of shipping options
 *     type: integer
 *     example: 1
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */

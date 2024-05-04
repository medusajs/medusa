import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm"

import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"
import { Product } from "./product"
import { ProductOptionValue } from "./product-option-value"

@Entity()
export class ProductOption extends SoftDeletableEntity {
  @Column()
  title: string

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    cascade: ["soft-remove", "remove"],
  })
  values: Relation<ProductOptionValue>[]

  @Column()
  product_id: string

  @ManyToOne(() => Product, (product) => product.options)
  @JoinColumn({ name: "product_id" })
  product: Relation<Product>

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "opt")
  }
}

/**
 * @schema ProductOption
 * title: "Product Option"
 * description: A Product Option defines properties that may vary between different variants of a Product. Common Product Options are "Size" and "Color". Admins are free to create any product options.
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - id
 *   - metadata
 *   - product_id
 *   - title
 *   - updated_at
 * properties:
 *   id:
 *     description: The product option's ID
 *     type: string
 *     example: opt_01F0YESHQBZVKCEXJ24BS6PCX3
 *   title:
 *     description: The title that the Product Option is defined by (e.g. `Size`).
 *     type: string
 *     example: Size
 *   values:
 *     description: The details of the values of the product option.
 *     type: array
 *     x-expandable: "values"
 *     items:
 *       $ref: "#/components/schemas/ProductOptionValue"
 *   product_id:
 *     description: The ID of the product that this product option belongs to.
 *     type: string
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   product:
 *     description: The details of the product that this product option belongs to.
 *     x-expandable: "product"
 *     nullable: true
 *     $ref: "#/components/schemas/Product"
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
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */

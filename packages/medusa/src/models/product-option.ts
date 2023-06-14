import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { Product } from "./product"
import { ProductOptionValue } from "./product-option-value"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ProductOption extends SoftDeletableEntity {
  @Column()
  title: string

  @OneToMany(() => ProductOptionValue, (value) => value.option, {
    cascade: ["soft-remove", "remove"],
  })
  values: ProductOptionValue[]

  @Column()
  product_id: string

  @ManyToOne(() => Product, (product) => product.options)
  @JoinColumn({ name: "product_id" })
  product: Product

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "opt")
  }
}

/**
 * @schema ProductOption
 * title: "Product Option"
 * description: "Product Options define properties that may vary between different variants of a Product. Common Product Options are \"Size\" and \"Color\", but Medusa doesn't limit what Product Options that can be defined."
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
 *     description: The Product Option Values that are defined for the Product Option. Available if the relation `values` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductOptionValue"
 *   product_id:
 *     description: The ID of the Product that the Product Option is defined for.
 *     type: string
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   product:
 *     description: A product object. Available if the relation `product` is expanded.
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
 */

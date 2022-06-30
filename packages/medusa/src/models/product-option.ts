import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { Product } from "./product"
import { ProductOptionValue } from "./product-option-value"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ProductOption extends SoftDeletableEntity {
  @Column()
  title: string

  @OneToMany(() => ProductOptionValue, (value) => value.option)
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
 * @schema product_option
 * title: "Product Option"
 * description: "Product Options define properties that may vary between different variants of a Product. Common Product Options are \"Size\" and \"Color\", but Medusa doesn't limit what Product Options that can be defined."
 * x-resourceId: product_option
 * properties:
 *   id:
 *     description: "The id of the Product Option. This value will be prefixed with `opt_`."
 *     type: string
 *   title:
 *     description: "The title that the Product Option is defined by (e.g. \"Size\")."
 *     type: string
 *   values:
 *     description: "The Product Option Values that are defined for the Product Option."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/product_option_value"
 *   product_id:
 *     description: "The id of the Product that the Product Option is defined for."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was deleted."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */

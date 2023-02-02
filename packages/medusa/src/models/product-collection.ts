import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { Product } from "./product"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import _ from "lodash"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class ProductCollection extends SoftDeletableEntity {
  @Column()
  title: string

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column({ nullable: true })
  handle: string | null

  @OneToMany(() => Product, (product) => product.collection)
  products?: Product[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private createHandleIfNotProvided(): void {
    if (this.id) return

    this.id = generateEntityId(this.id, "pcol")
    if (!this.handle) {
      this.handle = _.kebabCase(this.title)
    }
  }
}

/**
 * @schema ProductCollection
 * title: "Product Collection"
 * description: "Product Collections represents a group of Products that are related."
 * type: object
 * required:
 *   - title
 * properties:
 *   id:
 *     type: string
 *     description: The product collection's ID
 *     example: pcol_01F0YESBFAZ0DV6V831JXWH0BG
 *   title:
 *     description: "The title that the Product Collection is identified by."
 *     type: string
 *     example: Summer Collection
 *   handle:
 *     description: "A unique string that identifies the Product Collection - can for example be used in slug structures."
 *     type: string
 *     example: summer-collection
 *   products:
 *     description: The Products contained in the Product Collection. Available if the relation `products` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: A product collection object.
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */

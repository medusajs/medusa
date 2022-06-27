import { BeforeInsert, Column, Entity, Index, JoinTable, ManyToMany, OneToMany } from "typeorm";
import _ from "lodash"

import { Product } from "./product"
import { SoftDeletableEntity } from "../interfaces"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils"
import { Image } from "./image";

@Entity()
export class ProductCollection extends SoftDeletableEntity {
  @Column()
  title: string

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column({ nullable: true })
  handle: string

  @OneToMany(() => Product, (product) => product.collection)
  products: Product[]

  @ManyToMany(() => Image, { cascade: ["insert"] })
  @JoinTable({
    name: "product_collection_images",
    joinColumn: {
      name: "collection_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  images: Image[]

  @Column({ nullable: true })
  thumbnail: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

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
 * @schema product_collection
 * title: "Product Collection"
 * description: "Product Collections represents a group of Products that are related."
 * x-resourceId: product_collection
 * properties:
 *   id:
 *     description: "The id of the Product Collection. This value will be prefixed with `pcol_`."
 *     type: string
 *   title:
 *     description: "The title that the Product Collection is identified by."
 *     type: string
 *   handle:
 *     description: "A unique string that identifies the Product Collection - can for example be used in slug structures."
 *     type: string
 *   products:
 *     description: "The Products contained in the Product Collection."
 *     type: array
 *     items:
 *       type: object
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 */

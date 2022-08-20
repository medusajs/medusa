import { BaseEntity, Product } from "@medusajs/medusa"
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"

@Entity()
export class ProductReview extends BaseEntity {
  @Column()
  product_id: string

  @ManyToOne(() => Product, (product) => product.options)
  @JoinColumn({ name: "product_id" })
  product: Product

  @Column({ type: "int" })
  rating: number

  @Column()
  body: string

  @Index()
  @Column()
  email: string

  @Column()
  name: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "prev")
  }
}

/**
 * @schema product_review
 * title: "Product Reviews"
 * description: "Product reviews represent a review made by a customer for a specific
 * product."
 * x-resourceId: product_review
 * properties:
 *   id:
 *     description: "The id of the Product Review. This value will be prefixed with
 *     `prev_`."
 *     type: string
 *   product_id:
 *     description: "The id of the Product that the Review is related to."
 *     type: string
 *   rating:
 *     description: "The rating value of customer that has given a review (1 - 5)."
 *     type: integer
 *   body:
 *     description: "The rating body text of customer that has given a review."
 *     type: string
 *   email:
 *     description: "The email of customer that has given a review."
 *     type: string
 *   name:
 *     description: "The name of customer that has given a review."
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 */

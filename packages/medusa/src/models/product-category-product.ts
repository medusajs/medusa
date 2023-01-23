import { generateEntityId } from "../utils/generate-entity-id"
import { BaseEntity } from "../interfaces/models/base-entity"
import { Product, ProductCategory } from "."
import {
  BeforeInsert,
  Index,
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm"

@Entity()
export class ProductCategoryProduct extends BaseEntity {
  @Index()
  @Column()
  product_id: string

  @ManyToOne(() => Product, (product) => product.categories)
  @JoinColumn({ name: "product_id" })
  product: Product

  @Index()
  @Column()
  product_category_id: string

  @ManyToOne(() => ProductCategory, (productCategory) => productCategory.products)
  @JoinColumn({ name: "product_category_id" })
  category: ProductCategory

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pcp")
  }
}

/**
 * @schema ProductCategoryProduct
 * title: "ProductCategoryProduct"
 * description: "Represents a product category product"
 * x-resourceId: ProductCategoryProduct
 * type: object
 * required:
 *   - product_id
 *   - product_category_id
 * properties:
 *   id:
 *     type: string
 *     description: The product category product's ID
 *     example: pcp_01G2SG30J8C85S4A5CHM2S1NS2
 *   parent_category_id:
 *     description: The ID of the product category.
 *     type: string
 *   parent_category:
 *     description: A product category object. Available if the relation `parent_category` is expanded.
 *     type: object
 *   product_id:
 *     description: The ID of the product.
 *     type: string
 *   product:
 *     description: A product object. Available if the relation `product` is expanded.
 *     type: object
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 */

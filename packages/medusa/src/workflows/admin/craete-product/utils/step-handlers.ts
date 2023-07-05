import {
  IInventoryService,
  InventoryItemDTO,
  IProductModuleService,
  ProductTypes,
} from "@medusajs/types"
import { EntityManager } from "typeorm"
import { ProductVariantInventoryService } from "../../../../services"
import { Product, ProductVariant } from "../../../../models"

type InjectedDependencies = {
  manager: EntityManager
  productModuleService: IProductModuleService
  productVariantInventoryService: ProductVariantInventoryService
  inventoryService?: IInventoryService
}

export class AdminCreateProductHandlers {
  protected manager_: EntityManager
  protected productModuleService_: IProductModuleService
  protected inventoryService_?: IInventoryService
  protected productVariantInventoryService_: ProductVariantInventoryService

  constructor({
    manager,
    inventoryService,
    productModuleService,
    productVariantInventoryService,
  }: InjectedDependencies) {
    this.manager_ = manager
    this.inventoryService_ = inventoryService
    this.productModuleService_ = productModuleService
    this.productVariantInventoryService_ =
      productVariantInventoryService.withTransaction(manager)
  }

  async createProducts(data: any): Promise<ProductTypes.ProductDTO[]> {
    return await this.productModuleService_.create(data)
  }

  async removeProducts(
    products: ProductTypes.ProductDTO[]
  ): Promise<ProductTypes.ProductDTO[]> {
    return await this.productModuleService_.delete(products.map((p) => p.id))
  }

  async createInventoryItems(products: Product[] = []) {
    const context = { transactionManager: this.manager_ }

    const variants = products.reduce(
      (acc: ProductVariant[], product: Product) => {
        return acc.concat(product.variants)
      },
      []
    )

    return await Promise.all(
      variants.map(async (variant) => {
        if (!variant.manage_inventory) {
          return
        }

        const inventoryItem = await this.inventoryService_!.createInventoryItem(
          {
            sku: variant.sku,
            origin_country: variant.origin_country,
            hs_code: variant.hs_code,
            mid_code: variant.mid_code,
            material: variant.material,
            weight: variant.weight,
            length: variant.length,
            height: variant.height,
            width: variant.width,
          },
          context
        )

        return { variant, inventoryItem }
      })
    )
  }

  async removeInventoryItems(
    data: {
      variant: ProductVariant
      inventoryItem: InventoryItemDTO
    }[] = []
  ) {
    const context = { transactionManager: this.manager_ }

    return await Promise.all(
      data.map(async ({ inventoryItem }) => {
        return await this.inventoryService_!.deleteInventoryItem(
          inventoryItem.id,
          context
        )
      })
    )
  }

  async attachInventoryItems(
    data: {
      variant: ProductVariant
      inventoryItem: InventoryItemDTO
    }[]
  ) {
    return await Promise.all(
      data
        .filter((d) => d)
        .map(async ({ variant, inventoryItem }) => {
          return this.productVariantInventoryService_.attachInventoryItem(
            variant.id,
            inventoryItem.id
          )
        })
    )
  }
}

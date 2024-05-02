import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Product, ProductCategory, ProductVariant } from "@models"

export async function createProductCategories(
  manager: SqlEntityManager,
  categoriesData: any[]
): Promise<ProductCategory[]> {
  const categories: ProductCategory[] = []

  for (let categoryData of categoriesData) {
    let categoryDataClone = { ...categoryData }
    let parentCategory: ProductCategory | null = null
    const parentCategoryId = categoryDataClone.parent_category_id as string
    delete categoryDataClone.parent_category_id

    if (parentCategoryId) {
      parentCategory = await manager.findOne(ProductCategory, parentCategoryId)
    }

    const category = manager.create(ProductCategory, {
      ...categoryDataClone,
      parent_category: parentCategory,
    })

    categories.push(category)
  }

  await manager.persistAndFlush(categories)

  return categories
}

export async function createProducts(manager: SqlEntityManager, data: any[]) {
  const products: any[] = data.map((productData) => {
    return manager.create(Product, productData)
  })

  await manager.persistAndFlush(products)

  return products
}

export async function createProductVariants(
  manager: SqlEntityManager,
  data: any[]
) {
  const variants: any[] = data.map((variantsData) => {
    return manager.create(ProductVariant, variantsData)
  })

  await manager.persistAndFlush(variants)

  return variants
}

import { ProductCategory } from "@medusajs/medusa"

export async function productCategorySeeder(
  connection,
  data = {},
) {
  const manager = connection.manager

  const categoryD0A = await manager.create(ProductCategory, {
    id: "test-category-d0",
    name: "test category d0",
  })

  await manager.save(categoryD0A)

  const categoryD1A = await manager.create(ProductCategory, {
    id: "test-category-d1A",
    name: "test category d1A",
    parent_category: categoryD0A
  })

  await manager.save(categoryD1A)

  const categoryD2A = await manager.create(ProductCategory, {
    id: "test-category-d2A",
    name: "test category d2A",
    parent_category: categoryD1A
  })

  await manager.save(categoryD2A)

  const categoryD1B = await manager.create(ProductCategory, {
    id: "test-category-d1B",
    name: "test category d1B",
    parent_category: categoryD0A
  })

  await manager.save(categoryD1B)

  const categoryD2B = await manager.create(ProductCategory, {
    id: "test-category-d2B",
    name: "test category d2B",
    parent_category: categoryD1B
  })

  await manager.save(categoryD2B)
}

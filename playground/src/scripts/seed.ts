import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/utils"
import { createDefaultsWorkflow } from "@medusajs/core-flows"
import categoriesData from "../../data/categories.json"
import productsData from "../../data/products.json"
import customersData from "../../data/customers.json"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  logger.info("Starting playground seed...")

  // Step 1: Create default store, region, currency, sales channel
  logger.info("Creating default store infrastructure...")
  await createDefaultsWorkflow(container).run()

  // Resolve modules
  const productModule = container.resolve(Modules.PRODUCT)
  const customerModule = container.resolve(Modules.CUSTOMER)
  const pricingModule = container.resolve(Modules.PRICING)

  // Step 2: Create categories
  logger.info("Creating product categories...")
  const categories = await productModule.createProductCategories(
    categoriesData.map((cat) => ({
      name: cat.name,
      handle: cat.handle,
      description: cat.description,
      is_active: cat.is_active,
    }))
  )

  const categoryByHandle = new Map(categories.map((c) => [c.handle, c.id]))

  // Step 3: Create products with variants
  logger.info("Creating products...")
  for (const productInput of productsData) {
    const categoryId = categoryByHandle.get(productInput.category_handle)

    const product = await productModule.createProducts({
      title: productInput.title,
      handle: productInput.handle,
      description: productInput.description,
      subtitle: productInput.subtitle,
      is_giftcard: productInput.is_giftcard,
      discountable: productInput.discountable,
      status: productInput.status,
      categories: categoryId ? [{ id: categoryId }] : undefined,
      options: productInput.options.map((opt) => ({
        title: opt.title,
        values: opt.values.map((v) => ({ value: v })),
      })),
    })

    // Create variants for the product
    for (const variantInput of productInput.variants) {
      const variant = await productModule.createProductVariants({
        product_id: product.id,
        title: variantInput.title,
        sku: variantInput.sku,
        options: variantInput.options.map((opt, idx) => ({
          option_id: product.options[idx].id,
          value: opt.value,
        })),
      })

      // Create prices for the variant
      for (const priceInput of variantInput.prices) {
        await pricingModule.createPriceSets({
          prices: [
            {
              amount: priceInput.amount,
              currency_code: priceInput.currency_code,
            },
          ],
        })
      }
    }
  }

  // Step 4: Create customers
  logger.info("Creating customers...")
  for (const customerInput of customersData) {
    await customerModule.createCustomers({
      email: customerInput.email,
      first_name: customerInput.first_name,
      last_name: customerInput.last_name,
      phone: customerInput.phone,
      addresses: customerInput.addresses.map((addr) => ({
        first_name: addr.first_name,
        last_name: addr.last_name,
        address_1: addr.address_1,
        city: addr.city,
        province: addr.province,
        postal_code: addr.postal_code,
        country_code: addr.country_code,
        phone: addr.phone,
      })),
    })
  }

  logger.info("Playground seed completed successfully!")
}

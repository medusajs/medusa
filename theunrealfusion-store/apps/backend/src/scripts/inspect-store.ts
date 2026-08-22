import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function inspectStore({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  console.log("=== INSPECTING STORE DATA ===")

  try {
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "name", "currency_code", "countries.*", "payment_providers.*"],
    })
    console.log("REGIONS (" + regions.length + "):", JSON.stringify(regions, null, 2))
  } catch (err: any) {
    console.error("Error fetching regions:", err.message)
  }

  try {
    const { data: apiKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "token", "type", "title", "sales_channels.*"],
    })
    console.log("API KEYS:", JSON.stringify(apiKeys, null, 2))
  } catch (err: any) {
    console.error("Error fetching api keys:", err.message)
  }

  try {
    const { data: salesChannels } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name", "is_disabled"],
    })
    console.log("SALES CHANNELS:", JSON.stringify(salesChannels, null, 2))
  } catch (err: any) {
    console.error("Error fetching sales channels:", err.message)
  }

  try {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "variants.*"],
    })
    console.log("PRODUCTS COUNT:", products.length)
    if (products.length > 0) {
      console.log("SAMPLE PRODUCT:", JSON.stringify(products[0], null, 2))
    }
  } catch (err: any) {
    console.error("Error fetching products:", err.message)
  }
}

import axios from "axios"
import { MedusaContainer } from "@medusajs/framework/utils"
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

type OttoOptions = {
  apiKey: string
  sandbox?: boolean
}

export class OttoSyncService {
  private options: OttoOptions
  private baseUrl: string
  private productModule: IProductModuleService
  private logger: any

  constructor(container: MedusaContainer, options: OttoOptions) {
    this.options = options
    this.baseUrl = options.sandbox
      ? "https://sandbox.api.otto.market/v1"
      : "https://api.otto.market/v1"
    this.productModule = container.resolve(Modules.PRODUCT)
    this.logger = (container as any).resolve?.("logger") || console
  }

  private async ottoRequest(method: string, path: string, body?: unknown) {
    const { data } = await axios({
      method,
      url: `${this.baseUrl}${path}`,
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: body,
    })
    return data
  }

  // ── Product sync ──────────────────────────────────────────────────────────

  async syncProductsToOtto(): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = []
    let synced = 0

    const products = await this.productModule.listProducts({}, {
      select: ["id", "title", "description", "handle", "variants", "images", "metadata", "tags"],
      relations: ["variants", "images", "tags"],
    })

    const productLines = products.map((product) => {
      const variant = product.variants?.[0]
      const price = (variant as any)?.prices?.[0]?.amount || 0
      const ean = (product.metadata as any)?.ean || `ML${product.handle?.replace(/-/g, "").toUpperCase().slice(0, 10)}`

      return {
        productReference: product.handle,
        title: product.title,
        description: product.description || product.title,
        category: "Gifts & Occasions",
        brand: "MemoryLane Gifts",
        eans: [ean],
        mediaAssets: product.images?.slice(0, 10).map((i: any, idx: number) => ({
          type: idx === 0 ? "MAIN_IMAGE" : "PRODUCT_IMAGE",
          location: i.url,
        })) || [],
        attributes: {
          personalised: "true",
          material: (product.metadata as any)?.material || "Mixed",
          countryOfOrigin: "GB",
        },
        variants: [
          {
            sku: product.handle,
            ean,
            title: product.title,
            price: {
              amount: (price / 100).toFixed(2),
              currency: "EUR",
            },
            stock: 99,
          },
        ],
      }
    })

    // Otto accepts batch product submissions
    const batchSize = 50
    for (let i = 0; i < productLines.length; i += batchSize) {
      const batch = productLines.slice(i, i + batchSize)
      try {
        await this.ottoRequest("POST", "/products", { productLines: batch })
        synced += batch.length
        this.logger.info?.(`Otto: submitted batch of ${batch.length} products`)
      } catch (err) {
        const msg = `Otto batch ${i}–${i + batchSize} failed: ${err instanceof Error ? err.message : String(err)}`
        errors.push(msg)
        this.logger.error?.(msg)
      }
    }

    return { synced, errors }
  }

  // ── Order Import ──────────────────────────────────────────────────────────

  async importNewOttoOrders(): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = []
    let imported = 0

    try {
      const data = await this.ottoRequest("GET", "/orders?fulfillmentStatus=ANNOUNCED&limit=50")

      for (const order of data.resources || []) {
        this.logger.info?.(`Otto: new order ${order.salesOrderId}`)
        imported++
      }
    } catch (err) {
      errors.push(`Otto order import failed: ${err instanceof Error ? err.message : String(err)}`)
    }

    return { imported, errors }
  }

  // ── Shipping notification ─────────────────────────────────────────────────

  async markOttoOrderShipped(
    salesOrderId: string,
    positionItemIds: string[],
    trackingNumber: string,
    carrier: string
  ): Promise<void> {
    await this.ottoRequest("POST", "/shipments", {
      trackingKey: { carrier, trackingNumber },
      shipDate: new Date().toISOString(),
      shipFromAddress: {
        city: "London",
        countryCode: "GB",
        zipCode: "EC1A 1BB",
      },
      positionItems: positionItemIds.map((id) => ({
        positionItemId: id,
        salesOrderId,
        returnTrackingKey: null,
      })),
    })
  }

  async handleWebhook(event: string, payload: unknown): Promise<void> {
    this.logger.info?.(`Otto webhook: ${event}`)
  }
}

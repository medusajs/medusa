import axios from "axios"
import * as crypto from "crypto"
import { MedusaContainer } from "@medusajs/framework/utils"
import { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

type AmazonOptions = {
  sellerId: string
  marketplaceId: string     // e.g. "A1F83G8C2ARO7P" for UK
  clientId: string
  clientSecret: string
  refreshToken: string
  region?: string           // "eu-west-1" for EU
}

export class AmazonSyncService {
  private options: AmazonOptions
  private tokenCache: { token: string; expiresAt: number } | null = null
  private productModule: IProductModuleService
  private logger: any

  constructor(container: MedusaContainer, options: AmazonOptions) {
    this.options = options
    this.productModule = container.resolve(Modules.PRODUCT)
    this.logger = (container as any).resolve?.("logger") || console
  }

  private async getLwaToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token
    }

    const { data } = await axios.post(
      "https://api.amazon.com/auth/o2/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        refresh_token: this.options.refreshToken,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )

    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    }

    return this.tokenCache.token
  }

  private getEndpoint(): string {
    const region = this.options.region || "eu-west-1"
    if (region.startsWith("us")) return "https://sellingpartnerapi-na.amazon.com"
    if (region.startsWith("fe")) return "https://sellingpartnerapi-fe.amazon.com"
    return "https://sellingpartnerapi-eu.amazon.com"
  }

  private async spRequest(method: string, path: string, body?: unknown, params?: Record<string, string>) {
    const token = await this.getLwaToken()
    const { data } = await axios({
      method,
      url: `${this.getEndpoint()}${path}`,
      headers: {
        "x-amz-access-token": token,
        "Content-Type": "application/json",
      },
      data: body,
      params,
    })
    return data
  }

  // ── Listings ──────────────────────────────────────────────────────────────

  async syncProductsToAmazon(): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = []
    let synced = 0

    const products = await this.productModule.listProducts({}, {
      select: ["id", "title", "description", "handle", "variants", "images", "metadata"],
      relations: ["variants", "images"],
    })

    for (const product of products) {
      try {
        const sku = `ML-${product.handle?.toUpperCase()}`
        const variant = product.variants?.[0]
        const price = (variant as any)?.prices?.[0]?.amount || 0

        const listing = {
          productType: "GIFT",
          requirements: "LISTING",
          attributes: {
            item_name: [{ value: product.title, language_tag: "en_GB", marketplace_id: this.options.marketplaceId }],
            product_description: [{ value: (product.description || product.title).slice(0, 2000), language_tag: "en_GB", marketplace_id: this.options.marketplaceId }],
            brand: [{ value: "MemoryLane Gifts", language_tag: "en_GB", marketplace_id: this.options.marketplaceId }],
            list_price: [{ currency: "GBP", value: (price / 100).toFixed(2), marketplace_id: this.options.marketplaceId }],
            main_image_url: [{ media_location: product.images?.[0]?.url || "", marketplace_id: this.options.marketplaceId }],
            merchant_suggested_asin: [],
            fulfillment_availability: [{ fulfillment_channel_code: "DEFAULT", quantity: 99, marketplace_id: this.options.marketplaceId }],
          },
        }

        await this.spRequest(
          "PUT",
          `/listings/2021-08-01/items/${this.options.sellerId}/${sku}`,
          listing,
          { marketplaceIds: this.options.marketplaceId }
        )

        synced++
        this.logger.info?.(`Amazon: listed ${sku}`)
      } catch (err) {
        const msg = `Amazon listing failed for ${product.title}: ${err instanceof Error ? err.message : String(err)}`
        errors.push(msg)
        this.logger.error?.(msg)
      }
    }

    return { synced, errors }
  }

  // ── Order Import ──────────────────────────────────────────────────────────

  async importNewAmazonOrders(): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = []
    let imported = 0

    try {
      const createdAfter = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const data = await this.spRequest(
        "GET",
        "/orders/v0/orders",
        undefined,
        {
          MarketplaceIds: this.options.marketplaceId,
          CreatedAfter: createdAfter,
          OrderStatuses: "Unshipped,PartiallyShipped",
        }
      )

      for (const order of data.payload?.Orders || []) {
        this.logger.info?.(`Amazon: new order ${order.AmazonOrderId}`)
        imported++
      }
    } catch (err) {
      errors.push(`Amazon order import failed: ${err instanceof Error ? err.message : String(err)}`)
    }

    return { imported, errors }
  }

  // ── Confirm shipment ──────────────────────────────────────────────────────

  async confirmShipment(
    amazonOrderId: string,
    orderItemId: string,
    trackingNumber: string,
    carrier: string
  ): Promise<void> {
    await this.spRequest("POST", `/orders/v0/orders/${amazonOrderId}/shipment`, {
      marketplaceId: this.options.marketplaceId,
      packageDetail: {
        packageReferenceId: "1",
        carrierCode: carrier,
        trackingNumber,
        shipDate: new Date().toISOString(),
        orderItems: [{ orderItemId, quantity: 1 }],
      },
    })
  }

  // ── Webhook (SNS notification) ────────────────────────────────────────────

  async handleSnsNotification(notificationType: string, payload: unknown): Promise<void> {
    this.logger.info?.(`Amazon SP-API notification: ${notificationType}`)

    if (notificationType === "ORDER_CHANGE") {
      this.logger.info?.("Amazon order change notification — refresh order queue")
    }
  }
}

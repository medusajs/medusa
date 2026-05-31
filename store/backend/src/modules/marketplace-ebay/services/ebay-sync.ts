import axios from "axios"
import { MedusaContainer } from "@medusajs/framework/utils"
import { IProductModuleService, IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

type EbayOptions = {
  clientId: string
  clientSecret: string
  refreshToken: string
  sandbox?: boolean
  fulfillmentPolicyId: string
  paymentPolicyId: string
  returnPolicyId: string
  merchantLocationKey: string
}

type EbayTokenCache = {
  token: string
  expiresAt: number
}

export class EbaySyncService {
  private options: EbayOptions
  private baseUrl: string
  private tokenCache: EbayTokenCache | null = null
  private productModule: IProductModuleService
  private logger: any

  constructor(container: MedusaContainer, options: EbayOptions) {
    this.options = options
    this.baseUrl = options.sandbox
      ? "https://api.sandbox.ebay.com"
      : "https://api.ebay.com"
    this.productModule = container.resolve(Modules.PRODUCT)
    this.logger = (container as any).resolve?.("logger") || console
  }

  // ── Auth ─────────────────────────────────────────────────────────────────

  private async getAccessToken(): Promise<string> {
    if (this.tokenCache && Date.now() < this.tokenCache.expiresAt) {
      return this.tokenCache.token
    }

    const credentials = Buffer.from(`${this.options.clientId}:${this.options.clientSecret}`).toString("base64")
    const { data } = await axios.post(
      `${this.baseUrl}/identity/v1/oauth2/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.options.refreshToken,
        scope: "https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.fulfillment",
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    this.tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    }

    return this.tokenCache.token
  }

  private async ebayRequest(method: string, path: string, body?: unknown, params?: Record<string, string>) {
    const token = await this.getAccessToken()
    const { data } = await axios({
      method,
      url: `${this.baseUrl}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": "en-GB",
        "Content-Language": "en-GB",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB",
      },
      data: body,
      params,
    })
    return data
  }

  // ── Product Listing Sync ──────────────────────────────────────────────────

  async syncProductsToEbay(): Promise<{ synced: number; errors: string[] }> {
    const errors: string[] = []
    let synced = 0

    const products = await this.productModule.listProducts({}, {
      select: ["id", "title", "description", "handle", "variants", "images", "metadata"],
      relations: ["variants", "images"],
    })

    for (const product of products) {
      try {
        const sku = product.handle!
        const variant = product.variants?.[0]
        if (!variant) continue

        const price = (variant as any).prices?.[0]?.amount
        if (!price) continue

        const inventoryItem = {
          availability: {
            shipToLocationAvailability: {
              quantity: 99,
            },
          },
          condition: "NEW",
          product: {
            title: product.title,
            description: product.description || product.title,
            imageUrls: product.images?.map((i: any) => i.url).slice(0, 12) || [],
            aspects: {
              "Item Type": [(product.metadata as any)?.type || "Gift"],
              "Personalised": ["Yes"],
              "Country/Region of Manufacture": ["United Kingdom"],
            },
          },
        }

        await this.ebayRequest(
          "PUT",
          `/sell/inventory/v1/inventory_item/${sku}`,
          inventoryItem
        )

        const offer = {
          sku,
          marketplaceId: "EBAY_GB",
          format: "FIXED_PRICE",
          availableQuantity: 99,
          categoryId: "183448",
          listingDescription: product.description || product.title,
          listingPolicies: {
            fulfillmentPolicyId: this.options.fulfillmentPolicyId,
            paymentPolicyId: this.options.paymentPolicyId,
            returnPolicyId: this.options.returnPolicyId,
          },
          merchantLocationKey: this.options.merchantLocationKey,
          pricingSummary: {
            price: {
              currency: "GBP",
              value: (price / 100).toFixed(2),
            },
          },
          tax: {
            applyTax: true,
            vatPercentage: 20,
          },
        }

        try {
          const existing = await this.ebayRequest("GET", `/sell/inventory/v1/offer?sku=${sku}&marketplace_id=EBAY_GB`)
          if (existing.offers?.length) {
            await this.ebayRequest("PUT", `/sell/inventory/v1/offer/${existing.offers[0].offerId}`, offer)
          } else {
            await this.ebayRequest("POST", "/sell/inventory/v1/offer", offer)
          }
        } catch {
          await this.ebayRequest("POST", "/sell/inventory/v1/offer", offer)
        }

        synced++
        this.logger.info?.(`eBay: synced ${product.title}`)
      } catch (err) {
        const msg = `eBay sync failed for ${product.title}: ${err instanceof Error ? err.message : String(err)}`
        errors.push(msg)
        this.logger.error?.(msg)
      }
    }

    return { synced, errors }
  }

  // ── Order Import ──────────────────────────────────────────────────────────

  async importNewEbayOrders(): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = []
    let imported = 0

    try {
      const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const data = await this.ebayRequest(
        "GET",
        "/sell/fulfillment/v1/order",
        undefined,
        { filter: `creationdate:[${fromDate}..}`, limit: "50" }
      )

      for (const ebayOrder of data.orders || []) {
        if (ebayOrder.orderFulfillmentStatus !== "NOT_STARTED") continue

        this.logger.info?.(`eBay: new order ${ebayOrder.orderId} — acknowledge and queue for fulfillment`)
        imported++
      }
    } catch (err) {
      errors.push(`eBay order import failed: ${err instanceof Error ? err.message : String(err)}`)
    }

    return { imported, errors }
  }

  // ── Webhook handler ───────────────────────────────────────────────────────

  async handleWebhook(topic: string, payload: unknown): Promise<void> {
    this.logger.info?.(`eBay webhook: ${topic}`)

    if (topic === "MARKETPLACE_ACCOUNT_DELETION") {
      this.logger.info?.("eBay GDPR deletion request received")
    }
  }
}

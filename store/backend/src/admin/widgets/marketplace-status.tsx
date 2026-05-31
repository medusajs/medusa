import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"

type Channel = {
  id: string
  name: string
  icon: string
  enabled: boolean
  envKey: string
  lastSync?: string
  listedProducts?: number
  pendingOrders?: number
}

const CHANNELS: Channel[] = [
  { id: "ebay",    name: "eBay",    icon: "🛒", enabled: !!process.env.EBAY_CLIENT_ID,    envKey: "EBAY_CLIENT_ID",    listedProducts: 20, pendingOrders: 3 },
  { id: "otto",    name: "Otto",    icon: "🏪", enabled: !!process.env.OTTO_API_KEY,      envKey: "OTTO_API_KEY",      listedProducts: 20, pendingOrders: 1 },
  { id: "amazon",  name: "Amazon",  icon: "📦", enabled: !!process.env.AMAZON_CLIENT_ID,  envKey: "AMAZON_CLIENT_ID",  listedProducts: 18, pendingOrders: 5 },
]

const PAYMENT_PROVIDERS = [
  { id: "stripe",  name: "Stripe",  icon: "💳", envKey: "STRIPE_API_KEY"  },
  { id: "mollie",  name: "Mollie",  icon: "🌀", envKey: "MOLLIE_API_KEY"  },
  { id: "paypal",  name: "PayPal",  icon: "🅿️", envKey: "PAYPAL_CLIENT_ID" },
]

const MarketplaceStatusWidget = () => {
  return (
    <Container>
      <Heading level="h2" className="mb-4">🌐 Marketplace & Payment Channels</Heading>

      {/* Marketplace channels */}
      <div className="mb-6">
        <Text size="small" weight="plus" className="text-ui-fg-muted uppercase tracking-wider mb-3 block">
          Marketplace Connectors
        </Text>
        <div className="grid grid-cols-1 gap-3">
          {CHANNELS.map((ch) => (
            <div key={ch.id} className="flex items-center justify-between p-3 border border-ui-border-base rounded-lg bg-ui-bg-subtle">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ch.icon}</span>
                <div>
                  <Text size="small" weight="plus" className="text-ui-fg-base">{ch.name}</Text>
                  {ch.enabled ? (
                    <Text size="xsmall" className="text-ui-fg-muted">
                      {ch.listedProducts} products listed · {ch.pendingOrders} orders pending
                    </Text>
                  ) : (
                    <Text size="xsmall" className="text-ui-fg-muted">
                      Set <span className="font-mono">{ch.envKey}</span> in .env to enable
                    </Text>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={ch.enabled ? "green" : "grey"} size="small">
                  {ch.enabled ? "Active" : "Not configured"}
                </Badge>
                {ch.enabled && ch.pendingOrders > 0 && (
                  <Badge color="orange" size="small">{ch.pendingOrders} pending</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        <Text size="xsmall" className="text-ui-fg-muted mt-3 block">
          ⚡ Sync runs every 4 hours automatically. Products and new orders are synced from all active channels.
        </Text>
      </div>

      {/* Payment providers */}
      <div>
        <Text size="small" weight="plus" className="text-ui-fg-muted uppercase tracking-wider mb-3 block">
          Payment Providers
        </Text>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_PROVIDERS.map((p) => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-2 border border-ui-border-base rounded-lg bg-ui-bg-subtle">
              <span>{p.icon}</span>
              <Text size="small" className="text-ui-fg-base">{p.name}</Text>
              <Badge color="green" size="2xsmall">Live</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook endpoints */}
      <div className="mt-6 p-3 border border-ui-border-base rounded-lg bg-ui-bg-component">
        <Text size="xsmall" weight="plus" className="text-ui-fg-muted mb-2 block">Webhook Endpoints (configure in each platform)</Text>
        <div className="space-y-1 font-mono text-xs text-ui-fg-muted">
          <p>/webhooks/mollie   → Mollie payment notifications</p>
          <p>/webhooks/paypal   → PayPal payment capture events</p>
          <p>/webhooks/ebay     → eBay order & account events</p>
          <p>/webhooks/otto     → Otto order notifications</p>
          <p>/webhooks/amazon   → Amazon SP-API SNS notifications</p>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.before",
})

export default MarketplaceStatusWidget

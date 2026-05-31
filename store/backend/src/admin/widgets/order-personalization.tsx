import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"

type PersonalizationField = {
  label: string
  value: string
}

const FIELD_LABELS: Record<string, string> = {
  recipient_name: "Recipient Name",
  sender_name: "Sender Name",
  date: "Date",
  message: "Personal Message",
  occasion: "Occasion",
  font_style: "Font Style",
  nfc_url: "NFC Content URL",
  file_upload: "Uploaded File",
  material: "Material",
  color_variant: "Colour Variant",
}

const TYPE_COLORS: Record<string, "green" | "blue" | "orange" | "purple"> = {
  engraving: "orange",
  printing: "blue",
  nfc: "purple",
  mixed: "green",
}

function PersonalizationCard({ item }: { item: any }) {
  const meta = item.metadata || {}
  const fields: PersonalizationField[] = []

  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    if (meta[key]) {
      fields.push({ label, value: String(meta[key]) })
    }
  }

  const personType = meta.personalization_type as string
  const productionDays = meta.production_days

  return (
    <div className="border border-ui-border-base rounded-lg p-4 mb-3 bg-ui-bg-subtle">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Text size="base" weight="plus" className="text-ui-fg-base">
            {item.title}
          </Text>
          {item.variant_title && (
            <Text size="small" className="text-ui-fg-muted">
              {item.variant_title}
            </Text>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {personType && (
            <Badge color={TYPE_COLORS[personType] || "grey"} size="2xsmall">
              {personType.toUpperCase()}
            </Badge>
          )}
          {productionDays && (
            <Badge color="grey" size="2xsmall">
              {productionDays}d production
            </Badge>
          )}
        </div>
      </div>

      {fields.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {fields.map((f) => (
            <div key={f.label} className="flex gap-2">
              <Text size="small" className="text-ui-fg-muted min-w-[140px] flex-shrink-0">
                {f.label}:
              </Text>
              <Text
                size="small"
                className={`text-ui-fg-base break-words ${
                  f.label === "Personal Message" ? "italic" : ""
                }`}
              >
                {f.label === "NFC Content URL" ? (
                  <a href={f.value} target="_blank" rel="noreferrer" className="text-ui-fg-interactive underline">
                    {f.value}
                  </a>
                ) : (
                  f.value
                )}
              </Text>
            </div>
          ))}
        </div>
      ) : (
        <Text size="small" className="text-ui-fg-muted italic">
          No personalization details captured for this item.
        </Text>
      )}
    </div>
  )
}

const OrderPersonalizationWidget = ({ data }: { data: any }) => {
  const items = data?.items || []
  const personalizedItems = items.filter(
    (item: any) => item.metadata && Object.keys(item.metadata).length > 0
  )

  const hasGiftWrap = data?.metadata?.gift_wrap === "true"
  const giftMessage = data?.metadata?.gift_message

  return (
    <Container>
      <div className="mb-4 flex items-center justify-between">
        <Heading level="h2">🎨 Personalization Details</Heading>
        <div className="flex gap-2">
          {hasGiftWrap && (
            <Badge color="green" size="small">
              Gift Wrapped
            </Badge>
          )}
          {data?.metadata?.bulk_order === "true" && (
            <Badge color="blue" size="small">
              Bulk / Corporate Order
            </Badge>
          )}
        </div>
      </div>

      {giftMessage && (
        <div className="mb-4 p-3 bg-ui-tag-green-bg border border-ui-tag-green-border rounded-lg">
          <Text size="small" weight="plus" className="text-ui-tag-green-text mb-1">
            Gift Message (from checkout)
          </Text>
          <Text size="small" className="text-ui-fg-base italic">
            "{giftMessage}"
          </Text>
        </div>
      )}

      {personalizedItems.length > 0 ? (
        personalizedItems.map((item: any) => (
          <PersonalizationCard key={item.id} item={item} />
        ))
      ) : (
        <div className="text-center py-6">
          <Text className="text-ui-fg-muted">No personalization details for this order.</Text>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-ui-border-base">
        <Text size="xsmall" className="text-ui-fg-muted">
          ⚡ Production team: verify all details above before beginning production.
          Mark order as "In Production" once confirmed.
        </Text>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default OrderPersonalizationWidget

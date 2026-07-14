import React from "react"
import { Badge, StatusBadge, Tooltip } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ReactCountryFlag from "react-country-flag"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import { getCountryByIso2 } from "../data/countries"
import { ProductCell } from "../../components/table/table-cells/product/product-cell"
import { CollectionCell } from "../../components/table/table-cells/product/collection-cell"
import { SalesChannelsCell } from "../../components/table/table-cells/product/sales-channels-cell"
import { VariantCell } from "../../components/table/table-cells/product/variant-cell"
import { ProductStatusCell } from "../../components/table/table-cells/product/product-status-cell"
import { DateCell } from "../../components/table/table-cells/common/date-cell"
import { DisplayIdCell } from "../../components/table/table-cells/order/display-id-cell"
import { TotalCell } from "../../components/table/table-cells/order/total-cell"
import { TFunction } from "i18next"
import {
  getOrderPaymentStatus,
  getOrderFulfillmentStatus,
} from "../order-helpers"

export type CellRenderer<TData = any> = (
  value: any,
  row: TData,
  column: HttpTypes.AdminColumn,
  t: TFunction
) => React.ReactNode

export type CellAlignment = "left" | "center" | "right"

/**
 * Render modes that ship with a built-in cell renderer.
 */
export type BuiltInRenderMode =
  | "text"
  | "count"
  | "status"
  | "badge"
  | "badge_list"
  | "date"
  | "datetime"
  | "timestamp"
  | "currency"
  | "number"
  | "boolean"
  | "id"
  | "email"
  | "phone"
  | "url"
  | "image"
  | "json"
  | "product_info"
  | "collection"
  | "variants"
  | "sales_channels_list"
  | "customer_name"
  | "address"
  | "address_summary"
  | "country_code"
  | "display_id"

/**
 * A render mode key. Built-in modes are suggested for autocomplete, but any
 * custom string is accepted.
 */
export type RenderMode = BuiltInRenderMode | (string & {})
/**
 * A cell renderer plus the alignment it renders best at.
 */
export type CellRendererDefinition<TData = any> = {
  render: CellRenderer<TData>
  align?: CellAlignment
}

export type RendererRegistry = Map<string, CellRendererDefinition>

const cellRenderers: RendererRegistry = new Map()

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

const TextRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (value === null || value === undefined) {
    return "-"
  }
  return String(value)
}

const CountRenderer: CellRenderer = (value, _row, _column, t) => {
  const count = Array.isArray(value)
    ? value.length
    : typeof value === "number"
    ? value
    : 0
  return t("general.items", { count })
}

// TODO: if we expect users to use this renderer for their statuses, we need to provide a way for them to pass some
// sort of registry that passes the context field and resolves the status label and color based on it.
// Also, use translated value if available and remove hardcoded field conditional
const StatusRenderer: CellRenderer = (value, row, column, t) => {
  if (!value) {
    return "-"
  }

  if (
    column.field === "status" &&
    row.status &&
    (row.handle || row.is_giftcard !== undefined)
  ) {
    return <ProductStatusCell status={row.status} />
  }

  if (column.field === "payment_status" && t) {
    const { label, color } = getOrderPaymentStatus(t, value)
    return <StatusBadge color={color}>{label}</StatusBadge>
  }

  if (column.field === "fulfillment_status" && t) {
    const { label, color } = getOrderFulfillmentStatus(t, value)
    return <StatusBadge color={color}>{label}</StatusBadge>
  }

  // Generic status badge for other status types
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "published":
      case "fulfilled":
      case "paid":
        return "green"
      case "pending":
      case "proposed":
      case "processing":
        return "orange"
      case "draft":
        return "grey"
      case "rejected":
      case "failed":
      case "canceled":
        return "red"
      default:
        return "grey"
    }
  }

  // Use existing translation keys where available
  const getTranslatedStatus = (status: string): string => {
    if (!t) {
      return status
    }

    const lowerStatus = status.toLowerCase()
    switch (lowerStatus) {
      case "active":
        return t("general.active", "Active") as string
      case "published":
        return t("products.productStatus.published", "Published") as string
      case "draft":
        return t("orders.status.draft", "Draft") as string
      case "pending":
        return t("orders.status.pending", "Pending") as string
      case "canceled":
        return t("orders.status.canceled", "Canceled") as string
      default:
        // Try generic status translation with fallback
        return t(`status.${lowerStatus}`, status) as string
    }
  }

  const translatedValue = getTranslatedStatus(value)

  return (
    <StatusBadge color={getStatusColor(value)}>{translatedValue}</StatusBadge>
  )
}

const BadgeListRenderer: CellRenderer = (value, row, column, t) => {
  // Note: leaving for backwards compatibility, since it is how sales channels for products are visualized in many products tables
  // across the UI. Ideally we use the resolution below, so we unify how list of values in tables are visualized across the UI.
  if (column.render_mode === "sales_channels_list") {
    return <SalesChannelsCell salesChannels={row.sales_channels} />
  }

  let resolvedValue = value
  let computedMetadata = {} as Record<string, any>

  if (column.computed) {
    computedMetadata = column.computed.metadata ?? {}
    resolvedValue = row[computedMetadata.list_field]
  }

  // Generic badge list
  if (!Array.isArray(resolvedValue) || resolvedValue.length === 0) {
    return "-"
  }

  const items = resolvedValue.slice(0, 2)
  const remaining = resolvedValue.length - 2

  const resolveBadgeValue = (item: any) => {
    if (typeof item === "string") {
      return item
    }

    if (Object.keys(computedMetadata).length > 0) {
      return item[computedMetadata.display_field]
    }

    return item.name || item.title || item.value || "-"
  }

  return (
    <div className="flex gap-1">
      {items.map((item, index) => {
        return (
          <Badge key={index} size="xsmall">
            {resolveBadgeValue(item)}
          </Badge>
        )
      })}
      {remaining > 0 && (
        <Tooltip
          content={
            <ul>
              {resolvedValue.slice(2).map((item) => (
                <li key={item}>{resolveBadgeValue(item)}</li>
              ))}
            </ul>
          }
        >
          <Badge size="xsmall" color="grey">
            {t
              ? t("general.plusCountMore", "+ {{count}} more", {
                  count: remaining,
                })
              : `+${remaining}`}
          </Badge>
        </Tooltip>
      )}
    </div>
  )
}

const ProductInfoRenderer: CellRenderer = (_, row, _column, _t) => {
  return <ProductCell product={row} />
}

const CollectionRenderer: CellRenderer = (_, row, _column, _t) => {
  return <CollectionCell collection={row.collection} />
}

const VariantsRenderer: CellRenderer = (_, row, _column, _t) => {
  return <VariantCell variants={row.variants} />
}

// Order-specific renderers
const CustomerNameRenderer: CellRenderer = (_, row, _column, t) => {
  if (row.customer?.first_name || row.customer?.last_name) {
    const fullName = `${row.customer.first_name || ""} ${
      row.customer.last_name || ""
    }`.trim()
    if (fullName) {
      return fullName
    }
  }

  // Fall back to email
  if (row.customer?.email) {
    return row.customer.email
  }

  // Fall back to phone
  if (row.customer?.phone) {
    return row.customer.phone
  }

  return t ? t("customers.guest", "Guest") : "Guest"
}

const AddressSummaryRenderer: CellRenderer = (_, row, column, _t) => {
  let address: Record<string, string> | null = null
  if (column.field === "shipping_address_display") {
    address = row.shipping_address
  } else if (column.field === "billing_address_display") {
    address = row.billing_address
  } else {
    address = row.shipping_address || row.billing_address
  }

  if (!address) {
    return "-"
  }

  const parts: string[] = []

  if (address.address_1) {
    parts.push(address.address_1)
  }

  const locationParts: string[] = []
  if (address.city) {
    locationParts.push(address.city)
  }
  if (address.province) {
    locationParts.push(address.province)
  }
  if (address.postal_code) {
    locationParts.push(address.postal_code)
  }

  if (locationParts.length > 0) {
    parts.push(locationParts.join(", "))
  }

  if (address.country_code) {
    parts.push(address.country_code.toUpperCase())
  }

  return parts.join(" • ") || "-"
}

const CountryCodeRenderer: CellRenderer = (_, row, _column, _t) => {
  const countryCode = row.shipping_address?.country_code

  if (!countryCode) {
    return "-"
  }

  const country = getCountryByIso2(countryCode)
  const displayName = country?.display_name || countryCode.toUpperCase()

  return (
    <Tooltip content={displayName}>
      <div className="flex size-4 items-center justify-center overflow-hidden rounded-sm">
        <ReactCountryFlag
          countryCode={countryCode.toUpperCase()}
          svg
          style={{
            width: "16px",
            height: "16px",
          }}
          aria-label={displayName}
        />
      </div>
    </Tooltip>
  )
}

const DateRenderer: CellRenderer = (value, _row, _column, _t) => {
  return <DateCell date={value} />
}

const DisplayIdRenderer: CellRenderer = (value, _row, _column, _t) => {
  return <DisplayIdCell displayId={value} />
}

const CurrencyRenderer: CellRenderer = (value, row, _column, _t) => {
  return <TotalCell currencyCode={row.currency_code || "USD"} total={value} />
}

const NumberRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (value === null || value === undefined) {
    return "-"
  }

  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) {
    return "-"
  }

  return (num as number).toLocaleString()
}

const BooleanRenderer: CellRenderer = (value, _row, _column, t) => {
  if (value === null || value === undefined) {
    return "-"
  }

  const label = (
    value
      ? t
        ? t("fields.yes", "Yes")
        : "Yes"
      : t
      ? t("fields.no", "No")
      : "No"
  ) as string

  return (
    <Badge size="xsmall" color={value ? "green" : "grey"}>
      {label}
    </Badge>
  )
}

const IdRenderer: CellRenderer = (value, _row, _column, _t) => {
  return TextRenderer(value, _row, _column, _t)
}

const EmailRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (!value) {
    return "-"
  }

  return (
    <a
      href={`mailto:${value}`}
      className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
      onClick={(e) => e.stopPropagation()}
    >
      {value}
    </a>
  )
}

const PhoneRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (!value) {
    return "-"
  }

  return (
    <a
      href={`tel:${value}`}
      className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
      onClick={(e) => e.stopPropagation()}
    >
      {value}
    </a>
  )
}

const UrlRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (!value) {
    return "-"
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="max-w-[200px] truncate">{value}</span>
      <ArrowUpRightOnBox className="h-3 w-3 flex-shrink-0" />
    </a>
  )
}

const ImageRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (!value) {
    return "-"
  }

  return (
    <img
      src={value}
      alt=""
      className="h-8 w-8 rounded object-cover"
      onError={(e) => {
        ;(e.target as HTMLImageElement).style.display = "none"
      }}
    />
  )
}

const JsonRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (value === null || value === undefined) {
    return "-"
  }

  const jsonString = typeof value === "string" ? value : JSON.stringify(value)
  const truncated =
    jsonString.length > 50 ? jsonString.substring(0, 47) + "..." : jsonString

  return (
    <Tooltip
      content={
        <pre className="max-w-[400px] overflow-auto text-xs">
          {JSON.stringify(value, null, 2)}
        </pre>
      }
    >
      <span className="text-ui-fg-subtle cursor-help font-mono text-xs">
        {truncated}
      </span>
    </Tooltip>
  )
}

const BadgeRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (!value) {
    return "-"
  }

  return <Badge size="xsmall">{String(value)}</Badge>
}

// TODO: improve based on how we receive the data, probably targetting row
const AddressRenderer: CellRenderer = (value, row, column, _t) => {
  let address = value
  if (!address && column.field.includes("address")) {
    address = row[column.field.replace("_display", "")]
  }

  if (!address || typeof address !== "object") {
    return "-"
  }

  const parts: string[] = []
  if (address.address_1) {
    parts.push(address.address_1)
  }
  if (address.address_2) {
    parts.push(address.address_2)
  }
  if (address.city) {
    parts.push(address.city)
  }
  if (address.province) {
    parts.push(address.province)
  }
  if (address.postal_code) {
    parts.push(address.postal_code)
  }
  if (address.country_code) {
    parts.push(address.country_code.toUpperCase())
  }

  if (parts.length === 0) {
    return "-"
  }

  const fullAddress = parts.join(", ")
  const truncated =
    fullAddress.length > 40 ? fullAddress.substring(0, 37) + "..." : fullAddress

  return (
    <Tooltip content={fullAddress}>
      <span className="max-w-[200px] truncate">{truncated}</span>
    </Tooltip>
  )
}

// Register built-in renderers
cellRenderers.set("text", { render: TextRenderer })
cellRenderers.set("count", { render: CountRenderer })
cellRenderers.set("status", { render: StatusRenderer, align: "center" })
cellRenderers.set("badge_list", { render: BadgeListRenderer })
cellRenderers.set("date", { render: DateRenderer })
cellRenderers.set("timestamp", { render: DateRenderer })
cellRenderers.set("currency", { render: CurrencyRenderer, align: "right" })
cellRenderers.set("number", { render: NumberRenderer, align: "right" })
cellRenderers.set("boolean", { render: BooleanRenderer, align: "center" })
cellRenderers.set("id", { render: IdRenderer })
cellRenderers.set("email", { render: EmailRenderer })
cellRenderers.set("phone", { render: PhoneRenderer })
cellRenderers.set("url", { render: UrlRenderer })
cellRenderers.set("image", { render: ImageRenderer, align: "center" })
cellRenderers.set("json", { render: JsonRenderer })
cellRenderers.set("badge", { render: BadgeRenderer, align: "center" })
cellRenderers.set("datetime", { render: DateRenderer })

// Register product-specific renderers
cellRenderers.set("product_info", { render: ProductInfoRenderer })
cellRenderers.set("collection", { render: CollectionRenderer })
cellRenderers.set("variants", { render: VariantsRenderer })
cellRenderers.set("sales_channels_list", { render: BadgeListRenderer })

// Register order-specific renderers
cellRenderers.set("customer_name", { render: CustomerNameRenderer })
cellRenderers.set("address_summary", { render: AddressSummaryRenderer })
cellRenderers.set("country_code", {
  render: CountryCodeRenderer,
  align: "center",
})
cellRenderers.set("display_id", { render: DisplayIdRenderer })
cellRenderers.set("address", { render: AddressRenderer })

export function getCellRenderer(
  renderType?: string,
  dataType?: string
): CellRendererDefinition {
  const definition = renderType ? cellRenderers.get(renderType) : undefined
  if (definition) {
    return definition
  }

  switch (dataType) {
    case "date":
      return { render: DateRenderer }
    case "boolean":
      return { render: BooleanRenderer, align: "center" }
    case "enum":
      return { render: StatusRenderer, align: "center" }
    case "currency":
      return { render: CurrencyRenderer, align: "right" }
    default:
      return { render: TextRenderer }
  }
}

export function registerCellRenderer(
  type: RenderMode,
  def: CellRendererDefinition
) {
  cellRenderers.set(type, { render: def.render, align: def.align })
}

export function getColumnValue(row: any, column: HttpTypes.AdminColumn): any {
  if (column.computed) {
    return row
  }

  return getNestedValue(row, column.field)
}

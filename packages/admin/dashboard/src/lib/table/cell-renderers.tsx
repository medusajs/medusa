import React from "react"
import { Badge, StatusBadge, Tooltip } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ReactCountryFlag from "react-country-flag"
import { getCountryByIso2 } from "../data/countries"
import { ProductCell } from "../../components/table/table-cells/product/product-cell"
import { CollectionCell } from "../../components/table/table-cells/product/collection-cell"
import { SalesChannelsCell } from "../../components/table/table-cells/product/sales-channels-cell"
import { VariantCell } from "../../components/table/table-cells/product/variant-cell"
import { ProductStatusCell } from "../../components/table/table-cells/product/product-status-cell"
import { DateCell } from "../../components/table/table-cells/common/date-cell"
import { DisplayIdCell } from "../../components/table/table-cells/order/display-id-cell"
import { TotalCell } from "../../components/table/table-cells/order/total-cell"
import { MoneyAmountCell } from "../../components/table/table-cells/common/money-amount-cell"
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

export type RendererRegistry = Map<string, CellRenderer>

const cellRenderers: RendererRegistry = new Map()

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

const TextRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (value === null || value === undefined) return "-"
  return String(value)
}

const CountRenderer: CellRenderer = (value, _row, _column, t) => {
  const items = value || []
  const count = Array.isArray(items) ? items.length : 0
  return t("general.items", { count })
}

const StatusRenderer: CellRenderer = (value, row, column, t) => {
  if (!value) return "-"

  if (
    column.field === "status" &&
    row.status &&
    (row.handle || row.is_giftcard !== undefined)
  ) {
    return <ProductStatusCell status={row.status} />
  }

  if (column.context === "payment" && t) {
    const { label, color } = getOrderPaymentStatus(t, value)
    return <StatusBadge color={color}>{label}</StatusBadge>
  }

  if (column.context === "fulfillment" && t) {
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
    if (!t) return status

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
  // For sales channels
  if (
    column.field === "sales_channels_display" ||
    column.field === "sales_channels"
  ) {
    return <SalesChannelsCell salesChannels={row.sales_channels} />
  }

  // Generic badge list
  if (!Array.isArray(value)) return "-"

  const items = value.slice(0, 2)
  const remaining = value.length - 2

  return (
    <div className="flex gap-1">
      {items.map((item, index) => (
        <Badge key={index} size="xsmall">
          {typeof item === "string" ? item : item.name || item.title || "-"}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge size="xsmall" color="grey">
          {t
            ? t("general.plusCountMore", "+ {{count}} more", {
                count: remaining,
              })
            : `+${remaining}`}
        </Badge>
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
    if (fullName) return fullName
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
  let address = null
  if (column.field === "shipping_address_display") {
    address = row.shipping_address
  } else if (column.field === "billing_address_display") {
    address = row.billing_address
  } else {
    address = row.shipping_address || row.billing_address
  }

  if (!address) return "-"

  const parts = []

  if (address.address_1) {
    parts.push(address.address_1)
  }

  const locationParts = []
  if (address.city) locationParts.push(address.city)
  if (address.province) locationParts.push(address.province)
  if (address.postal_code) locationParts.push(address.postal_code)

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

  if (!countryCode) return <div className="flex w-full justify-center">-</div>

  const country = getCountryByIso2(countryCode)
  const displayName = country?.display_name || countryCode.toUpperCase()

  return (
    <div className="flex w-full items-center justify-center">
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
    </div>
  )
}

const DateRenderer: CellRenderer = (value, _row, _column, _t) => {
  return <DateCell date={value} />
}

const DisplayIdRenderer: CellRenderer = (value, _row, _column, _t) => {
  return <DisplayIdCell displayId={value} />
}

const CurrencyRenderer: CellRenderer = (value, row, _column, _t) => {
  const currencyCode = row.currency_code || "USD"
  return (
    <MoneyAmountCell currencyCode={currencyCode} amount={value} align="right" />
  )
}

const TotalRenderer: CellRenderer = (value, row, _column, _t) => {
  const currencyCode = row.currency_code || "USD"
  return <TotalCell currencyCode={currencyCode} total={value} />
}

// Register built-in renderers
cellRenderers.set("text", TextRenderer)
cellRenderers.set("count", CountRenderer)
cellRenderers.set("status", StatusRenderer)
cellRenderers.set("badge_list", BadgeListRenderer)
cellRenderers.set("date", DateRenderer)
cellRenderers.set("timestamp", DateRenderer)
cellRenderers.set("currency", CurrencyRenderer)
cellRenderers.set("total", TotalRenderer)

// Register product-specific renderers
cellRenderers.set("product_info", ProductInfoRenderer)
cellRenderers.set("collection", CollectionRenderer)
cellRenderers.set("variants", VariantsRenderer)
cellRenderers.set("sales_channels_list", BadgeListRenderer)

// Register order-specific renderers
cellRenderers.set("customer_name", CustomerNameRenderer)
cellRenderers.set("address_summary", AddressSummaryRenderer)
cellRenderers.set("country_code", CountryCodeRenderer)
cellRenderers.set("display_id", DisplayIdRenderer)

export function getCellRenderer(
  renderType?: string,
  dataType?: string
): CellRenderer {
  if (renderType && cellRenderers.has(renderType)) {
    return cellRenderers.get(renderType)!
  }

  switch (dataType) {
    case "number":
    case "string":
      return TextRenderer
    case "date":
      return DateRenderer
    case "boolean":
      return (value, _row, _column, t) => {
        if (t) {
          return value ? t("fields.yes", "Yes") : t("fields.no", "No")
        }
        return value ? "Yes" : "No"
      }
    case "enum":
      return StatusRenderer
    case "currency":
      return CurrencyRenderer
    default:
      return TextRenderer
  }
}

export function registerCellRenderer(type: string, renderer: CellRenderer) {
  cellRenderers.set(type, renderer)
}

export function getColumnValue(row: any, column: HttpTypes.AdminColumn): any {
  if (column.computed) {
    return row
  }

  return getNestedValue(row, column.field)
}

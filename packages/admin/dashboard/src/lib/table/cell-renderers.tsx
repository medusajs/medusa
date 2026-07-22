import React from "react"
import { Badge, Tooltip } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ReactCountryFlag from "react-country-flag"
import { ArrowUpRightOnBox } from "@medusajs/icons"
import { getCountryByIso2 } from "../data/countries"
import { ProductCell } from "../../components/table/table-cells/product/product-cell"
import { CollectionCell } from "../../components/table/table-cells/product/collection-cell"
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
import { DataTableStatusIndicator } from "../../components/data-table/components/data-table-status-cell/data-table-status-cell"
import { TruncatedText } from "../../components/common/truncated-text"
import { isEmpty } from "../is-empty"

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
  | "handle"
  | "count"
  | "status"
  | "badges"
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
  | "name"
  | "address"
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
  /**
   * Whether the data table shows a hover tooltip with the full value when this
   * cell's content is truncated. Set `false` for renderers that manage their
   * own overflow (e.g. they already wrap content in a tooltip). Defaults to
   * `true`. A column can override this via `metadata.truncate_tooltip`.
   */
  truncateTooltip?: boolean
}

export type RendererRegistry = Map<string, CellRendererDefinition>

const cellRenderers: RendererRegistry = new Map()

/**
 * A resolver supplies the domain-specific input a *generic, predefined*
 * renderer needs — either the renderer's expected VALUE (e.g. a status
 * `{ color, label }`) or a fully custom ReactNode — while the renderer keeps
 * ownership of the shared presentation (pill markup, empty state, alignment).
 * A column opts in via `metadata.resolver: "<key>"`. This lets a consumer inject
 * logic/labels a static config can't express WITHOUT re-implementing the cell.
 */
export type CellResolver<TData = any> = (
  value: any,
  row: TData,
  t: TFunction
) => any

const cellResolvers: Map<string, CellResolver> = new Map()

/**
 * Register a named resolver that generic renderers can consult via
 * `column.metadata.resolver`. Overriding an existing key replaces it (lets a
 * consuming app swap a built-in resolver).
 */
export function registerCellResolver(key: string, resolver: CellResolver) {
  cellResolvers.set(key, resolver)
}

export function getCellResolver(key?: string): CellResolver | undefined {
  return key ? cellResolvers.get(key) : undefined
}

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

const TextRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (isEmpty(value)) {
    return "-"
  }
  return String(value)
}

const HandleRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (isEmpty(value)) {
    return "-"
  }
  return `/${value}`
}

const CountRenderer: CellRenderer = (value, row, column, t) => {
  let resolvedValue = value
  const listField = column?.metadata?.list_field
  const showItemsLabel = column?.metadata?.show_items_label === true

  if (listField) {
    const relation = row[listField]
    resolvedValue = Array.isArray(relation) ? relation.length : relation
  }

  if (Array.isArray(resolvedValue)) {
    return showItemsLabel
      ? t("general.items", { count: resolvedValue.length })
      : resolvedValue.length
  }

  if (typeof resolvedValue === "number") {
    return showItemsLabel
      ? t("general.items", { count: resolvedValue })
      : resolvedValue
  }

  return showItemsLabel ? t("general.items", { count: 0 }) : 0
}

type StatusColor = "green" | "red" | "blue" | "orange" | "grey" | "purple"

type StatusVariant = {
  color?: StatusColor
  /** Literal label. */
  label?: string
  /** i18n key; translated with `label` (or the raw value) as fallback. */
  label_key?: string
}

const renderStatusPill = (
  variant: StatusVariant,
  fallbackLabel: string,
  t: TFunction
): React.ReactNode => {
  const label = variant.label_key
    ? (t(variant.label_key, variant.label ?? fallbackLabel) as string)
    : variant.label ?? fallbackLabel
  return (
    <DataTableStatusIndicator color={variant.color ?? "grey"}>
      {label}
    </DataTableStatusIndicator>
  )
}

/**
 * Generic, data-driven status renderer. Resolution order:
 * 1. `metadata.resolver` — a registered resolver returning either a variant
 *    `{ color, label|label_key }` or a custom ReactNode. Use for dynamic
 *    statuses (derived from the row / runtime) or bespoke pills.
 * 2. `metadata.status_variants` — a static `value -> { color, label|label_key }`
 *    map (zero-code path for known enums). `metadata.value_field` reads the
 *    status off a different field/path when needed.
 * 3. Neutral grey pill showing the raw value.
 */
const StatusRenderer: CellRenderer = (value, row, column, t) => {
  const metadata = column.metadata ?? {}
  const rawValue =
    metadata.value_field !== undefined
      ? getNestedValue(row, metadata.value_field)
      : value

  const resolver = getCellResolver(metadata.resolver)
  if (resolver) {
    const resolved = resolver(rawValue, row, t)
    if (isEmpty(resolved)) {
      return "-"
    }
    if (React.isValidElement(resolved)) {
      return resolved
    }
    return renderStatusPill(
      resolved as StatusVariant,
      String(rawValue ?? ""),
      t
    )
  }

  const variants = metadata.status_variants as
    | Record<string, StatusVariant>
    | undefined
  if (variants) {
    const variant = variants[String(rawValue)]
    if (variant) {
      return renderStatusPill(variant, String(rawValue), t)
    }
  }

  if (isEmpty(rawValue)) {
    return "-"
  }
  return (
    <DataTableStatusIndicator color="grey">
      {String(rawValue)}
    </DataTableStatusIndicator>
  )
}

/**
 * Generic badge renderer for a single value or a list. Metadata:
 * - `list_field`: read the array from `row[list_field]` instead of the cell value.
 * - `display_field`: label to read off object items (else name/title/value).
 * - `max_visible`: how many badges to show before collapsing to "+N more" (default 2).
 */
const BadgesRenderer: CellRenderer = (value, row, column, t) => {
  const metadata = column.metadata ?? {}
  const maxVisible: number =
    typeof metadata.max_visible === "number" ? metadata.max_visible : 2

  const resolveLabel = (item: any): string => {
    if (isEmpty(item)) {
      return ""
    }
    if (typeof item === "string" || typeof item === "number") {
      return String(item)
    }
    if (metadata.display_field) {
      return item[metadata.display_field] ?? ""
    }
    return item.name || item.title || item.value || ""
  }

  const resolved = metadata.list_field ? row[metadata.list_field] : value

  if (!Array.isArray(resolved)) {
    const label = resolveLabel(resolved)
    return label ? (
      <div className="flex min-w-0">
        <Badge size="xsmall" className="min-w-0">
          <TruncatedText text={label} />
        </Badge>
      </div>
    ) : (
      "-"
    )
  }

  const items = resolved.filter((item) => item !== null && item !== undefined)
  if (items.length === 0) {
    return "-"
  }

  const visible = items.slice(0, maxVisible)
  const remaining = items.length - maxVisible

  return (
    <div className="flex min-w-0 items-center gap-1">
      {visible.map((item, index) => (
        <Badge key={index} size="xsmall" className="min-w-0">
          <TruncatedText text={resolveLabel(item)} />
        </Badge>
      ))}
      {remaining > 0 && (
        <Tooltip
          content={
            <ul>
              {items.slice(maxVisible).map((item, index) => (
                <li key={index}>{resolveLabel(item)}</li>
              ))}
            </ul>
          }
        >
          <Badge size="xsmall" color="grey" className="shrink-0">
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

/**
 * Generic name renderer. Builds "first last" from `first_name`/`last_name`,
 * with metadata:
 * - `name_source`: dotted path to the object holding the name fields (e.g.
 *   "customer"). Omit to read them off the row itself (e.g. Customer, User).
 * - `fallback_fields`: ordered dotted paths (relative to the row) to try when
 *   there is no name (e.g. ["customer.email", "customer.phone"]).
 * - `empty_label_key` / `empty_label`: i18n key + fallback for the empty case.
 */
const NameRenderer: CellRenderer = (_, row, column, t) => {
  const metadata = column.metadata ?? {}
  const source = metadata.name_source
    ? getNestedValue(row, metadata.name_source)
    : row

  const name = [source?.first_name, source?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()
  if (name) {
    return name
  }

  const fallbackFields: string[] = metadata.fallback_fields ?? []
  for (const path of fallbackFields) {
    const fallbackValue = getNestedValue(row, path)
    if (fallbackValue) {
      return fallbackValue
    }
  }

  if (metadata.empty_label_key && t) {
    return t(metadata.empty_label_key, metadata.empty_label ?? "-") as string
  }
  return "-"
}

/**
 * Generic address renderer. Reads the address object from
 * `metadata.address_field` (dotted path) and formats it. Metadata:
 * - `address_field` (required): path to the address object on the row.
 * - `separator`: joins the address parts (default " • ").
 * Long results truncate with a tooltip showing the full address.
 */
const AddressRenderer: CellRenderer = (_, row, column, _t) => {
  const address: Record<string, string> | undefined = column.metadata
    ?.address_field
    ? getNestedValue(row, column.metadata.address_field)
    : undefined

  if (!address || typeof address !== "object") {
    return "-"
  }

  const separator: string = column.metadata?.separator ?? " • "

  const parts: string[] = []
  if (address.address_1) {
    parts.push(address.address_1)
  }
  if (address.address_2) {
    parts.push(address.address_2)
  }

  const locality = [address.city, address.province, address.postal_code]
    .filter(Boolean)
    .join(", ")
  if (locality) {
    parts.push(locality)
  }

  if (address.country_code) {
    parts.push(address.country_code.toUpperCase())
  }

  const full = parts.join(separator)
  if (!full) {
    return "-"
  }

  return <TruncatedText text={full} className="max-w-[220px]" />
}

const CountryCodeRenderer: CellRenderer = (_, row, column, _t) => {
  const countryCode = getNestedValue(
    row,
    column.metadata?.country_code_field ?? ""
  )

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
  if (isEmpty(value)) {
    return "-"
  }

  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) {
    return "-"
  }

  return (num as number).toLocaleString()
}

const BooleanRenderer: CellRenderer = (value, _row, _column, t) => {
  if (isEmpty(value)) {
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
      <TruncatedText text={value} className="max-w-[200px]" />
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
  if (isEmpty(value)) {
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

// Register built-in renderers
cellRenderers.set("text", { render: TextRenderer })
cellRenderers.set("handle", { render: HandleRenderer })
cellRenderers.set("count", { render: CountRenderer })
// `status`, `boolean` render pills/badges, `image` renders an <img>, and the
// composite/self-tooltipping renderers below manage their own overflow — so
// they opt out of the data-table's generic truncation tooltip.
cellRenderers.set("status", { render: StatusRenderer, truncateTooltip: false })
cellRenderers.set("date", { render: DateRenderer })
cellRenderers.set("timestamp", { render: DateRenderer })
cellRenderers.set("currency", { render: CurrencyRenderer, align: "right" })
cellRenderers.set("number", { render: NumberRenderer, align: "right" })
cellRenderers.set("boolean", {
  render: BooleanRenderer,
  align: "center",
  truncateTooltip: false,
})
cellRenderers.set("id", { render: IdRenderer })
cellRenderers.set("email", { render: EmailRenderer })
cellRenderers.set("phone", { render: PhoneRenderer })
cellRenderers.set("url", { render: UrlRenderer, truncateTooltip: false })
cellRenderers.set("image", {
  render: ImageRenderer,
  align: "center",
  truncateTooltip: false,
})
cellRenderers.set("json", { render: JsonRenderer, truncateTooltip: false })
cellRenderers.set("datetime", { render: DateRenderer })
cellRenderers.set("badges", { render: BadgesRenderer, truncateTooltip: false })
cellRenderers.set("name", { render: NameRenderer })
cellRenderers.set("address", {
  render: AddressRenderer,
  truncateTooltip: false,
})
cellRenderers.set("country_code", {
  render: CountryCodeRenderer,
  align: "center",
  truncateTooltip: false,
})

// Register product-specific renderers
cellRenderers.set("product_info", {
  render: ProductInfoRenderer,
  truncateTooltip: false,
})
cellRenderers.set("collection", {
  render: CollectionRenderer,
  truncateTooltip: false,
})
cellRenderers.set("variants", {
  render: VariantsRenderer,
  truncateTooltip: false,
})

// Register order-specific renderers
cellRenderers.set("display_id", { render: DisplayIdRenderer })

// Core status resolvers, consumed by the generic `status` renderer via a
// column's `metadata.resolver`. They reuse the same helpers/cells the rest of
// the admin uses (single source of truth) — product returns a component, the
// order ones return a { color, label } variant.
registerCellResolver("product_status", (value) => (
  <ProductStatusCell status={value} />
))
registerCellResolver("order_payment_status", (value, _row, t) => {
  return value ? getOrderPaymentStatus(t, value) : null
})
registerCellResolver("order_fulfillment_status", (value, _row, t) => {
  return value ? getOrderFulfillmentStatus(t, value) : null
})

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

/**
 * Register a cell renderer for a render mode in the global registry.
 */
export function defineCellRenderer(
  type: RenderMode,
  def: CellRendererDefinition
) {
  cellRenderers.set(type, {
    render: def.render,
    align: def.align,
    truncateTooltip: def.truncateTooltip,
  })
}

export function getColumnValue(row: any, column: HttpTypes.AdminColumn): any {
  if (column.computed) {
    return row
  }

  return getNestedValue(row, column.field)
}

import { Badge, StatusBadge, Tooltip } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"
import { getCountryByIso2 } from "./data/countries"
import { getStylizedAmount } from "./money-amount-helpers"

// Helper function to get nested value from object using dot notation
const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

// Helper function to format date
const formatDate = (
  date: string | Date,
  format: "short" | "long" | "relative" = "short"
) => {
  const dateObj = new Date(date)

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    case "long":
      return dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    case "relative": {
      const now = new Date()
      const diffInMs = now.getTime() - dateObj.getTime()
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

      if (diffInDays === 0) {
        return "Today"
      }
      if (diffInDays === 1) {
        return "Yesterday"
      }
      if (diffInDays < 7) {
        return `${diffInDays} days ago`
      }

      return dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    }
    default:
      return dateObj.toLocaleDateString()
  }
}

// Payment status display
const PaymentStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "captured":
        return "green"
      case "pending":
      case "awaiting":
        return "orange"
      case "failed":
      case "canceled":
        return "red"
      default:
        return "grey"
    }
  }

  return <StatusBadge color={getStatusColor(status)}>{status}</StatusBadge>
}

// Fulfillment status display
const FulfillmentStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "fulfilled":
      case "shipped":
        return "green"
      case "partially_fulfilled":
      case "preparing":
        return "orange"
      case "canceled":
      case "returned":
        return "red"
      case "pending":
      case "not_fulfilled":
        return "grey"
      default:
        return "grey"
    }
  }

  return <StatusBadge color={getStatusColor(status)}>{status}</StatusBadge>
}

// Generic status badge
const GenericStatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge color="grey" className="capitalize">
      {status}
    </Badge>
  )
}

// Display strategies registry
export const DISPLAY_STRATEGIES = {
  // Known semantic types with pixel-perfect display
  status: {
    payment: (value: any) => <PaymentStatusBadge status={value} />,
    fulfillment: (value: any) => <FulfillmentStatusBadge status={value} />,
    default: (value: any) => <GenericStatusBadge status={value} />,
  },

  currency: {
    default: (value: any, row: any) => {
      if (value === null || value === undefined) {
        return "-"
      }
      const currencyCode = row.currency_code || "USD"
      const formatted = getStylizedAmount(value, currencyCode)

      return (
        <div className="flex h-full w-full items-center justify-end text-right">
          <span className="truncate">{formatted}</span>
        </div>
      )
    },
  },

  timestamp: {
    creation: (value: any) => {
      return value ? formatDate(value, "short") : "-"
    },
    update: (value: any) => {
      return value ? formatDate(value, "relative") : "-"
    },
    default: (value: any) => {
      return value ? formatDate(value, "short") : "-"
    },
  },

  identifier: {
    order: (value: any) => `#${value}`,
    default: (value: any) => value,
  },

  email: {
    default: (value: any) => value || "-",
  },

  // Generic fallbacks for custom fields
  enum: {
    default: (value: any) => <GenericStatusBadge status={value} />,
  },

  // Base type fallbacks
  string: {
    default: (value: any) => value || "-",
  },

  number: {
    default: (value: any) => value?.toLocaleString() || "0",
  },

  boolean: {
    default: (value: any) => (
      <Badge color={value ? "green" : "grey"}>{value ? "Yes" : "No"}</Badge>
    ),
  },

  object: {
    relationship: (value: any) => {
      if (!value || typeof value !== "object") {
        return "-"
      }

      // Try common display fields
      if (value.name) {
        return value.name
      }
      if (value.title) {
        return value.title
      }
      if (value.email) {
        return value.email
      }
      if (value.display_name) {
        return value.display_name
      }

      return JSON.stringify(value)
    },
    default: (value: any) => {
      if (!value || typeof value !== "object") {
        return "-"
      }

      // Try common display fields
      if (value.name) {
        return value.name
      }
      if (value.title) {
        return value.title
      }
      if (value.email) {
        return value.email
      }

      return JSON.stringify(value)
    },
  },

  // Date types (in addition to timestamp)
  date: {
    default: (value: any) => {
      return value ? formatDate(value, "short") : "-"
    },
  },

  datetime: {
    default: (value: any) => {
      return value ? formatDate(value, "long") : "-"
    },
  },

  // Computed columns
  computed: {
    display: (value: any) => value || "-",
    default: (value: any) => value || "-",
  },
}

// Strategy selection function
export const getDisplayStrategy = (column: any) => {
  const semanticStrategies =
    DISPLAY_STRATEGIES[column.semantic_type as keyof typeof DISPLAY_STRATEGIES]
  if (semanticStrategies) {
    const contextStrategy =
      semanticStrategies[column.context as keyof typeof semanticStrategies]
    if (contextStrategy) {
      return contextStrategy
    }

    const defaultStrategy = semanticStrategies.default
    if (defaultStrategy) {
      return defaultStrategy
    }
  }

  // Fallback to data type
  // Map 'text' data type to 'string' strategy
  const dataType = column.data_type === "text" ? "string" : column.data_type
  const dataTypeStrategies =
    DISPLAY_STRATEGIES[dataType as keyof typeof DISPLAY_STRATEGIES]
  if (dataTypeStrategies) {
    const defaultStrategy = dataTypeStrategies.default
    if (defaultStrategy) {
      return defaultStrategy
    }
  }

  // Final fallback
  return (value: any) => String(value || "-")
}

// Computed column computation functions
export const COMPUTED_COLUMN_FUNCTIONS = {
  customer_name: (row: any) => {
    // Try customer object first
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

    return "Guest"
  },

  address_summary: (row: any, column?: any) => {
    // Determine which address to use based on the column field
    let address: Record<string, string> | null = null
    if (column?.field === "shipping_address_display") {
      address = row.shipping_address
    } else if (column?.field === "billing_address_display") {
      address = row.billing_address
    } else {
      // Fallback to shipping address if no specific field
      address = row.shipping_address || row.billing_address
    }

    if (!address) {
      return "-"
    }

    // Build address parts in a meaningful order
    const parts: string[] = []

    // Include street address if available
    if (address.address_1) {
      parts.push(address.address_1)
    }

    // City, Province/State, Postal Code
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

    // Country
    if (address.country_code) {
      parts.push(address.country_code.toUpperCase())
    }

    return parts.join(" • ") || "-"
  },

  country_code: (row: any) => {
    // Get country code from shipping address
    const countryCode = row.shipping_address?.country_code

    if (!countryCode) {
      return <div className="flex w-full justify-center">-</div>
    }

    // Get country information
    const country = getCountryByIso2(countryCode)
    const displayName = country?.display_name || countryCode.toUpperCase()

    // Display country flag with tooltip - centered in the cell
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
  },
}

// Entity-specific column overrides
export const ENTITY_COLUMN_OVERRIDES = {
  orders: {
    // Override for customer column that combines multiple fields
    customer: {
      accessor: (row: any) => {
        // Complex logic for combining fields
        const shipping = row.shipping_address
        const customer = row.customer

        if (shipping?.first_name || shipping?.last_name) {
          return `${shipping.first_name || ""} ${
            shipping.last_name || ""
          }`.trim()
        }
        if (customer?.first_name || customer?.last_name) {
          return `${customer.first_name || ""} ${
            customer.last_name || ""
          }`.trim()
        }
        return customer?.email || "Guest"
      },
    },
  },
}

// Helper function to get entity-specific accessor
export const getEntityAccessor = (
  entity: string,
  fieldName: string,
  column?: any
) => {
  // Check if this is a computed column
  if (column?.computed) {
    const computationFn =
      COMPUTED_COLUMN_FUNCTIONS[
        column.computed.type as keyof typeof COMPUTED_COLUMN_FUNCTIONS
      ]
    if (computationFn) {
      // Return a wrapper function that passes the column info
      return (row: any) => computationFn(row, column)
    }
  }

  const entityOverrides =
    ENTITY_COLUMN_OVERRIDES[entity as keyof typeof ENTITY_COLUMN_OVERRIDES]
  if (entityOverrides) {
    const fieldOverride =
      entityOverrides[fieldName as keyof typeof entityOverrides]
    if (fieldOverride?.accessor) {
      return fieldOverride.accessor
    }
  }

  // Default accessor using dot notation
  return (row: any) => getNestedValue(row, fieldName)
}

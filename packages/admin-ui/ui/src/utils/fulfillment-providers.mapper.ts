import { Option } from "../types/shared"

export default function (provider: string): Option {
  switch (provider) {
    case "shipengine":
      return {
        label: import.meta.env.GATSBY_SHIPENGINE_LABEL || "MarketHaus Shipping",
        value: "shipengine",
      }
    case "shipstation":
      return {
        label: "ShipStation",
        value: "shipstation",
      }
    case "primecargo":
      return {
        label: "Prime Cargo",
        value: "primecargo",
      }
    case "manual":
      return {
        label: "Manual",
        value: "manual",
      }
    case "webshipper":
      return {
        label: "Webshipper",
        value: "webshipper",
      }
    case "unisco":
      return {
        label: "Unisco",
        value: "unisco",
      }
    default:
      return {
        label: provider,
        value: provider,
      }
  }
}

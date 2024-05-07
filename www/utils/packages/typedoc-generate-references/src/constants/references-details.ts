import { TypeDocOptions } from "typedoc"
import { getEntryPoints } from "../utils/get-options.js"

export const customModuleServiceNames: Record<string, string> = {
  "inventory-next": "IInventoryServiceNext",
  "stock-location-next": "IStockLocationServiceNext",
}

// if any module requires a custom formatting to their title representation,
// they're added to this object
export const customModuleTitles: Record<string, string> = {
  "api-key": "API Key",
}

// if any module requires custom options, they're added to this object
export const customModulesOptions: Record<string, Partial<TypeDocOptions>> = {
  "inventory-next": {
    entryPoints: getEntryPoints(
      "packages/core/types/src/inventory/service-next.ts"
    ),
  },
  "stock-location-next": {
    entryPoints: getEntryPoints(
      "packages/core/types/src/stock-location/service-next.ts"
    ),
  },
}

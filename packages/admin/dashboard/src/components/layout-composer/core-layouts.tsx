import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { LayoutDefinition } from "./types"
import { SingleColumnLayoutComponent } from "../layout/pages/single-column-page"
import { TwoColumnLayoutComponent } from "../layout/pages/two-column-page"

export const CORE_LAYOUTS: LayoutDefinition[] = [
  {
    id: CORE_LAYOUT_IDS.SINGLE_COLUMN,
    sections: [{ id: "main", ordering: "list" }],
    Component: SingleColumnLayoutComponent,
  },
  {
    id: CORE_LAYOUT_IDS.TWO_COLUMN,
    sections: [
      { id: "main", ordering: "list" },
      { id: "side", ordering: "list" },
    ],
    Component: TwoColumnLayoutComponent,
  },
]

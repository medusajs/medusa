import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { LayoutDefinition } from "./types"
import {
  SingleColumnLayoutComponent,
  SingleRowLayoutComponent,
  TwoColumnLayoutComponent,
} from "../layout/pages"

export const CORE_LAYOUTS: LayoutDefinition[] = [
  {
    id: CORE_LAYOUT_IDS.SINGLE_COLUMN,
    sections: [{ id: "main", ordering: "list" }],
    Component: SingleColumnLayoutComponent,
  },
  {
    id: CORE_LAYOUT_IDS.SINGLE_ROW,
    sections: [{ id: "main", ordering: "horizontal-list" }],
    Component: SingleRowLayoutComponent,
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

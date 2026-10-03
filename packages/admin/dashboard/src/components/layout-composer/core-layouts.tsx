import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { LayoutDefinition } from "./types"
import {
  SingleColumnLayoutComponent,
  SingleRowLayoutComponent,
  TwoColumnLayoutComponent,
} from "../layout/pages"
import { MainSidebarLayoutComponent } from "../layout/main-layout/main-sidebar-layout-component"
import { SettingsSidebarLayoutComponent } from "../layout/settings-layout/settings-sidebar-layout-component"

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
  {
    id: CORE_LAYOUT_IDS.SETTINGS_SIDEBAR,
    sections: [
      { id: "general", ordering: "list" },
      { id: "developer", ordering: "list" },
      { id: "myAccount", ordering: "list" },
      { id: "extensions", ordering: "list" },
    ],
    Component: SettingsSidebarLayoutComponent,
  },
  {
    id: CORE_LAYOUT_IDS.MAIN_SIDEBAR,
    sections: [
      { id: "top", ordering: "list" },
      { id: "sales", ordering: "list" },
      { id: "catalog", ordering: "list" },
      { id: "customers", ordering: "list" },
      { id: "marketing", ordering: "list" },
      { id: "extensions", ordering: "list" },
    ],
    Component: MainSidebarLayoutComponent,
  },
]

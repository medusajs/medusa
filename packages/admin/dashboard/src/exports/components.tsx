/**
 * Public component exports for `@medusajs/dashboard/components`.
 */

import {
  Layouts,
  CUSTOMIZE_IDS,
  LayoutComposer as LayoutComposerImpl,
  LayoutComposerProps as LayoutComposerPropsImpl,
  LayoutEntry,
} from "../components/layout-composer"

type LayoutComposerProps<TLayoutId extends Layouts, TData> = Omit<
  LayoutComposerPropsImpl<TLayoutId, TData>,
  "customizeId" | "controlSize"
>
const LayoutComposerRoot = <TLayoutId extends Layouts, TData>({
  widgetsZonePrefix,
  preferredLayoutId,
  sections,
  data,
  hasOutlet = true,
  disableWidgets = false,
}: LayoutComposerProps<TLayoutId, TData>) => {
  return (
    <LayoutComposerImpl
      widgetsZonePrefix={widgetsZonePrefix}
      preferredLayoutId={preferredLayoutId}
      sections={sections}
      data={data}
      hasOutlet={hasOutlet}
      customizeId={CUSTOMIZE_IDS.PAGE}
      controlSize="default"
      disableWidgets={disableWidgets}
    />
  )
}

export const LayoutComposer = Object.assign(LayoutComposerRoot, {
  Entry: LayoutEntry,
})

export type { LayoutComponentProps } from "../components/layout-composer/types"

export {
  ConfigurableDataTable,
  type ConfigurableDataTableProps,
} from "../components/table/configurable-data-table/configurable-data-table"

export { ActionMenu } from "../components/common/action-menu"
export type {
  Action,
  ActionGroup,
  ActionMenuProps,
} from "../components/common/action-menu"

export { ConditionalTooltip } from "../components/common/conditional-tooltip"
export { default as DisplayId } from "../components/common/display-id/display-id"
export { Form } from "../components/common/form"
export { IconAvatar } from "../components/common/icon-avatar"
export { JsonViewSection } from "../components/common/json-view-section"
export { Listicle, type ListicleProps } from "../components/common/listicle"
export {
  NoRecords,
  NoResults,
  type NoResultsProps,
} from "../components/common/empty-table-content"
export { SectionRow, type SectionRowProps } from "../components/common/section"
export {
  SidebarLink,
  type SidebarLinkProps,
} from "../components/common/sidebar-link/sidebar-link"
export { Thumbnail } from "../components/common/thumbnail"
export { KeyboundForm } from "../components/utilities/keybound-form"

export { Combobox } from "../components/inputs/combobox"
export { CountrySelect } from "../components/inputs/country-select"
export { HandleInput } from "../components/inputs/handle-input"

export {
  DataTable,
  type DataTableProps,
} from "../components/data-table/data-table"

export { DataGrid, type DataGridProps } from "../components/data-grid/data-grid"
export {
  createDataGridHelper,
  createDataGridPriceColumns,
} from "../components/data-grid/helpers"

export {
  ProductCell,
  ProductHeader,
} from "../components/table/table-cells/product/product-cell"
export {
  ProductStatusCell,
  ProductStatusHeader,
} from "../components/table/table-cells/product/product-status-cell"
export {
  SalesChannelHeader,
  SalesChannelsCell,
} from "../components/table/table-cells/product/sales-channels-cell"
export {
  VariantCell,
  VariantHeader,
} from "../components/table/table-cells/product/variant-cell"

export {
  RouteDrawer,
  RouteFocusModal,
  StackedDrawer,
  StackedFocusModal,
  useRouteModal,
  useStackedModal,
} from "../components/modals"

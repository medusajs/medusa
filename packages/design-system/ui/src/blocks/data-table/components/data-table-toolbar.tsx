import { DataTableFilterBar } from "@/blocks/data-table/components/data-table-filter-bar"
import { clx } from "@/utils/clx"
import * as React from "react"

interface DataTableToolbarTranslations {
  /**
   * The label for the clear all filters button
   * @default "Clear all"
   */
  clearAll?: string
  /**
   * The tooltip for the sorting menu
   */
  sort?: string
  /**
   * The tooltip for the columns menu
   */
  columns?: string
}

interface DataTableToolbarProps {
  /**
   * Additional classes to pass to the wrapper `div` of the component.
   */
  className?: string
  /**
   * The children to show in the toolbar.
   */
  children?: React.ReactNode
  /**
   * The translations of strings in the toolbar.
   */
  translations?: DataTableToolbarTranslations
  /**
   * Custom content to render in the filter bar
   */
  filterBarContent?: React.ReactNode
  /**
   * Whether to always render the filter bar, even when there are no active
   * filters or custom content. Useful to reserve its space and avoid layout
   * shifts when filters are added or removed.
   */
  alwaysShowFilterBar?: boolean
}

/**
 * Checks whether the consumer rendered an explicit `DataTable.FilterBar` among
 * the given nodes, either as a toolbar child or as the filter bar content.
 *
 * The toolbar already renders a filter bar of its own. When a consumer also
 * renders one, both instances read the same filtering state from the data table
 * context, so they render an identical copy of the active filter chips and of
 * the clear-all button. In that case the toolbar must not render its own bar.
 */
const isFilterBarElement = (node: React.ReactNode): boolean => {
  if (!React.isValidElement(node)) {
    return false
  }

  return node.type === DataTableFilterBar
}

const hasExplicitFilterBar = (props: DataTableToolbarProps): boolean => {
  let found = false

  const search = (children: React.ReactNode) => {
    if (found) {
      return
    }

    React.Children.forEach(children, (child) => {
      if (found) {
        return
      }

      if (isFilterBarElement(child)) {
        found = true
        return
      }

      // A filter bar can also be nested one level deep, for example inside a
      // wrapper element used for layout.
      if (React.isValidElement(child)) {
        const props = (child.props ?? {}) as { children?: React.ReactNode }
        search(props.children)
      }
    })
  }

  search(props.children)
  search(props.filterBarContent)

  return found
}

/**
 * Toolbar shown for the data table.
 */
const DataTableToolbar = (props: DataTableToolbarProps) => {
  const renderFilterBar = !hasExplicitFilterBar(props)

  return (
    <div className="flex flex-col divide-y">
      <div className={clx("flex items-center px-6 py-4", props.className)}>
        {props.children}
      </div>
      {renderFilterBar && (
        <DataTableFilterBar
          clearAllFiltersLabel={props.translations?.clearAll}
          alwaysShow={props.alwaysShowFilterBar}
        >
          {props.filterBarContent}
        </DataTableFilterBar>
      )}
    </div>
  )
}

export { DataTableToolbar }
export type { DataTableToolbarProps, DataTableToolbarTranslations }

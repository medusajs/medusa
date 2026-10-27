import { Tabs } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link, useSearchParams } from "react-router-dom"

export const VIEW_QUERY_PARAM = "view"

export type OrderListView = "all" | "ready-to-ship" | "shipped"

/**
 * Reads the order list's active tab from the `view` query param. Falls
 * back to `all` for anything unrecognized (including an absent param),
 * so a stale/typo'd `?view=` value degrades to the default tab rather
 * than rendering nothing.
 */
export const getOrderListView = (
  searchParams: URLSearchParams
): OrderListView => {
  const view = searchParams.get(VIEW_QUERY_PARAM)

  if (view === "ready-to-ship" || view === "shipped") {
    return view
  }

  return "all"
}

/**
 * Builds the href for a tab link: the current search with `view` set to
 * the target tab (or removed entirely for `all`, so the default tab's
 * URL stays param-free). Every other query param (e.g. a tab's own
 * prefixed pagination offset) is preserved untouched - each tab's table
 * reads only its own namespaced params, so there's nothing to collide.
 */
const buildTabHref = (
  view: OrderListView,
  searchParams: URLSearchParams
): string => {
  const next = new URLSearchParams(searchParams)

  if (view === "all") {
    next.delete(VIEW_QUERY_PARAM)
  } else {
    next.set(VIEW_QUERY_PARAM, view)
  }

  const search = next.toString()

  return search ? `?${search}` : ""
}

/**
 * The Orders page's tab bar - `All` / `Ready to Ship` / `Shipped` -
 * rendered above the table, matching Veeqo's layout (tabs are page
 * content, not sidebar navigation). Each tab is a real `Link` to a
 * distinct, bookmarkable URL via the `view` query param, not a
 * client-only toggle: switching tabs is a navigation, so the browser's
 * back/forward buttons and direct links to `?view=ready-to-ship` both
 * work.
 */
export const OrderListTabs = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const activeView = getOrderListView(searchParams)

  return (
    <Tabs value={activeView}>
      <Tabs.List>
        <Tabs.Trigger value="all" asChild>
          <Link to={buildTabHref("all", searchParams)}>
            {t("orders.list.tabs.all")}
          </Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="ready-to-ship" asChild>
          <Link to={buildTabHref("ready-to-ship", searchParams)}>
            {t("orders.list.tabs.readyToShip")}
          </Link>
        </Tabs.Trigger>
        <Tabs.Trigger value="shipped" asChild>
          <Link to={buildTabHref("shipped", searchParams)}>
            {t("orders.list.tabs.shipped")}
          </Link>
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  )
}

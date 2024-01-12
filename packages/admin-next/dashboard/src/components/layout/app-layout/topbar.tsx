import { Sidebar } from "@medusajs/icons"
import { Breadcrumbs } from "./breadcrumbs"
import { Notifications } from "./notifications"
import { SearchToggle } from "./search-toggle"

export const Topbar = () => {
  return (
    <div className="hidden items-center justify-between px-4 py-1 md:flex">
      <div className="flex items-center gap-x-1.5">
        <Sidebar className="text-ui-fg-muted" />
        <Breadcrumbs />
      </div>
      <div className="text-ui-fg-muted flex items-center gap-x-1">
        <SearchToggle />
        <Notifications />
      </div>
    </div>
  )
}

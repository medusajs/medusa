import { Sidebar } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
import { Breadcrumbs } from "./breadcrumbs"
import { Notifications } from "./notifications"
import { SearchToggle } from "./search-toggle"

export const Topbar = () => {
  return (
    <div className="hidden items-center justify-between px-3 py-1 md:flex">
      <div className="flex items-center gap-x-1.5">
        <IconButton variant="transparent" className="h-7 w-7 p-0">
          <Sidebar className="text-ui-fg-muted" />
        </IconButton>
        <Breadcrumbs />
      </div>
      <div className="text-ui-fg-muted flex items-center gap-x-1">
        <SearchToggle />
        <Notifications />
      </div>
    </div>
  )
}

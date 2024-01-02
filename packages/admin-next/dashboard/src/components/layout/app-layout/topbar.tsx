import { Sidebar } from "@medusajs/icons";
import { Breadcrumbs } from "./breadcrumbs";
import { Notifications } from "./notifications";
import { Search } from "./search";

export const Topbar = () => {
  return (
    <div className="items-center justify-between py-1 px-4 hidden md:flex">
      <div className="flex items-center gap-x-1.5">
        <Sidebar className="text-ui-fg-muted" />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-x-1 text-ui-fg-muted">
        <Search />
        <Notifications />
      </div>
    </div>
  );
};

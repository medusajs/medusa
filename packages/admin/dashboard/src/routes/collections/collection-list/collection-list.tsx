import { Outlet } from "react-router-dom"

import { CollectionListTable } from "./components/collection-list-table"

import after from "virtual:medusa/widgets/product_collection/list/after"
import before from "virtual:medusa/widgets/product_collection/list/before"

export const CollectionList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <CollectionListTable />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <Outlet />
    </div>
  )
}

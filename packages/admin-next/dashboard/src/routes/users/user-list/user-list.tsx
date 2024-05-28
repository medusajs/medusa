import { Outlet } from "react-router-dom"

import { UserListTable } from "./components/user-list-table"

import after from "virtual:medusa/widgets/user/list/after"
import before from "virtual:medusa/widgets/user/list/before"

export const UserList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => (
        <div key={i}>
          <w.Component />
        </div>
      ))}
      <UserListTable />
      {after.widgets.map((w, i) => (
        <div key={i}>
          <w.Component />
        </div>
      ))}
      <Outlet />
    </div>
  )
}

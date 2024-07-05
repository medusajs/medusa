import { Outlet } from "react-router-dom"
import { UserListTable } from "./components/user-list-table"

export const UserList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <UserListTable />
      <Outlet />
    </div>
  )
}

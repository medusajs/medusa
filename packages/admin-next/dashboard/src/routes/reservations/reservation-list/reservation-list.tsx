import { Outlet } from "react-router-dom"
import { ReservationListTable } from "./components/reservation-list-table"

import after from "virtual:medusa/widgets/reservation/list/after"
import before from "virtual:medusa/widgets/reservation/list/before"

export const ReservationList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <ReservationListTable />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component key={i} />
          </div>
        )
      })}
      <Outlet />
    </div>
  )
}

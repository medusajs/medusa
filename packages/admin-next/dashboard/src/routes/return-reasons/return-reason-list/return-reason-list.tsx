import { Outlet } from "react-router-dom"
import { ReturnReasonCallout } from "./components/return-reason-callout"
import { ReturnReasonOverview } from "./components/return-reason-overview"

export const ReturnReasonList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <ReturnReasonCallout />
      <ReturnReasonOverview />
      <Outlet />
    </div>
  )
}

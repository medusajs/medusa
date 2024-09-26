import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { ReservationListTable } from "./components/reservation-list-table"

export const ReservationList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("reservation.list.before"),
        after: getWidgets("reservation.list.after"),
      }}
    >
      <ReservationListTable />
    </SingleColumnPage>
  )
}

import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { ReservationListTable } from "./components/reservation-list-table"

export const ReservationList = () => {
  const { getWidgets } = useDashboardExtension()

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

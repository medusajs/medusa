import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { ReservationListTable } from "./components/reservation-list-table"

export const ReservationList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="reservation.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ReservationListTable">
              <ReservationListTable />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

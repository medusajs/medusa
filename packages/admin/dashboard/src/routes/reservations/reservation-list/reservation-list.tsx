import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { ReservationListTable } from "./components/reservation-list-table"
import { ConfigurableReservationListTable } from "./components/reservation-list-table/configurable-reservation-list-table"

export const ReservationList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="reservation.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ReservationListTable">
              {isViewConfigEnabled ? (
                <ConfigurableReservationListTable />
              ) : (
                <ReservationListTable />
              )}
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

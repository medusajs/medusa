import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { CampaignListTable } from "./components/campaign-list-table"

export const CampaignList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="campaign.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="CampaignListTable">
            <CampaignListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}

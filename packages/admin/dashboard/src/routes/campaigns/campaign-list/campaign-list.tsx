import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { CampaignListTable } from "./components/campaign-list-table"
import { ConfigurableCampaignListTable } from "./components/configurable-campaign-list-table"

export const CampaignList = () => {
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  return (
    <LayoutComposer
      widgetsZonePrefix="campaign.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <LayoutComposer.Entry id="CampaignListTable">
            {isViewConfigEnabled ? (
              <ConfigurableCampaignListTable />
            ) : (
              <CampaignListTable />
            )}
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}

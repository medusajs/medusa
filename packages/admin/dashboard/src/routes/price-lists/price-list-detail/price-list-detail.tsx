import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useParams } from "react-router-dom"

import { usePriceList } from "../../../hooks/api/price-lists"
import { PriceListConfigurationSection } from "./components/price-list-configuration-section"
import { PriceListGeneralSection } from "./components/price-list-general-section"
import { PriceListProductSection } from "./components/price-list-product-section"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"

export const PriceListDetails = () => {
  const { id } = useParams()

  const { price_list, isLoading, isError, error } = usePriceList(id!)

  if (isLoading || !price_list) {
    return (
      <TwoColumnPageSkeleton
        mainSections={2}
        sidebarSections={1}
        showJSON
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="price_list.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={price_list}
      sections={{
        main: (
          <>
            <PriceListGeneralSection priceList={price_list} />
            <PriceListProductSection priceList={price_list} />
            <MetadataSection data={price_list} />
            <JsonViewSection data={price_list} />
            <RequiredPermissionsSection />
          </>
        ),
        side: (
          <>
            <PriceListConfigurationSection priceList={price_list} />
          </>
        ),
      }}
    />
  )
}

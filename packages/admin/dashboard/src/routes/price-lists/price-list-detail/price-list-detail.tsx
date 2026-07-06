import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useParams } from "react-router-dom"

import { usePriceList } from "../../../hooks/api/price-lists"
import { PriceListConfigurationSection } from "./components/price-list-configuration-section"
import { PriceListGeneralSection } from "./components/price-list-general-section"
import { PriceListProductSection } from "./components/price-list-product-section"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"

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
            <LayoutComposer.Entry id="PriceListGeneralSection">
              <PriceListGeneralSection priceList={price_list} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="PriceListProductSection">
              <PriceListProductSection priceList={price_list} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(price_list)}
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="PriceListConfigurationSection">
              <PriceListConfigurationSection priceList={price_list} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

import { Outlet, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { usePriceList } from "../../../hooks/api/price-lists"
import { PricingConfigurationSection } from "./components/pricing-configuration-section"
import { PricingGeneralSection } from "./components/pricing-general-section"
import { PricingProductSection } from "./components/pricing-product-section"

export const PricingDetail = () => {
  const { id } = useParams()

  const { price_list, isLoading, isError, error } = usePriceList(id!)

  if (isLoading || !price_list) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
      <div className="flex w-full flex-col gap-y-2">
        <PricingGeneralSection priceList={price_list} />
        <PricingProductSection priceList={price_list} />
        <div className="flex w-full flex-col gap-y-2 xl:hidden">
          <PricingConfigurationSection priceList={price_list} />
        </div>
        <JsonViewSection data={price_list} />
      </div>
      <div className="hidden w-full max-w-[400px] flex-col gap-y-2 xl:flex">
        <PricingConfigurationSection priceList={price_list} />
      </div>
      <Outlet />
    </div>
  )
}

import { useAdminPriceList } from "medusa-react"
import { Outlet, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { PricingGeneralSection } from "./components/pricing-general-section"
import { PricingProductSection } from "./components/pricing-product-section"

export const PricingDetail = () => {
  const { id } = useParams()

  const { price_list, isLoading, isError, error } = useAdminPriceList(id!)

  if (isLoading || !price_list) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <PricingGeneralSection priceList={price_list} />
      <PricingProductSection priceList={price_list} />
      <JsonViewSection data={price_list} />
      <Outlet />
    </div>
  )
}

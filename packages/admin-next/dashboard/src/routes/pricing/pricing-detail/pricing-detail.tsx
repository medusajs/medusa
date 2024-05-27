import { Outlet, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { usePriceList } from "../../../hooks/api/price-lists"
import { PricingConfigurationSection } from "./components/pricing-configuration-section"
import { PricingGeneralSection } from "./components/pricing-general-section"
import { PricingProductSection } from "./components/pricing-product-section"

import after from "virtual:medusa/widgets/price_list/details/after"
import before from "virtual:medusa/widgets/price_list/details/before"
import sideAfter from "virtual:medusa/widgets/price_list/details/side/after"
import sideBefore from "virtual:medusa/widgets/price_list/details/side/before"

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
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={price_list} />
          </div>
        )
      })}
      <div className="flex flex-col gap-x-4 lg:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <PricingGeneralSection priceList={price_list} />
          <PricingProductSection priceList={price_list} />
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={price_list} />
              </div>
            )
          })}
          <div className="hidden xl:block">
            <JsonViewSection data={price_list} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 xl:mt-0 xl:max-w-[400px]">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={price_list} />
              </div>
            )
          })}
          <PricingConfigurationSection priceList={price_list} />
          {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={price_list} />
              </div>
            )
          })}
          <div className="xl:hidden">
            <JsonViewSection data={price_list} />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

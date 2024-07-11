import { Outlet, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { usePriceList } from "../../../hooks/api/price-lists"
import { PriceListConfigurationSection } from "./components/price-list-configuration-section"
import { PriceListGeneralSection } from "./components/price-list-general-section"
import { PriceListProductSection } from "./components/price-list-product-section"

import after from "virtual:medusa/widgets/price_list/details/after"
import before from "virtual:medusa/widgets/price_list/details/before"
import sideAfter from "virtual:medusa/widgets/price_list/details/side/after"
import sideBefore from "virtual:medusa/widgets/price_list/details/side/before"

export const PriceListDetails = () => {
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
      <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
        <div className="flex flex-1 flex-col gap-y-3">
          <PriceListGeneralSection priceList={price_list} />
          <PriceListProductSection priceList={price_list} />
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
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 xl:mt-0 xl:max-w-[440px]">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={price_list} />
              </div>
            )
          })}
          <PriceListConfigurationSection priceList={price_list} />
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

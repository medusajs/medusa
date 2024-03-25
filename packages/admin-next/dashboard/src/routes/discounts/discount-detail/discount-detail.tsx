import { useAdminDiscount } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { DiscountConfigurationSection } from "./components/discount-configurations-section"
import { DiscountGeneralSection } from "./components/discount-general-section"

import { DetailsSection } from "./components/details-section"
import { DiscountConditionsSection } from "./components/discount-conditions-section"
import { RedemptionsSection } from "./components/discount-redemptions-section"
import { discountLoader, expand } from "./loader"

import after from "medusa-admin:widgets/discount/details/after"
import before from "medusa-admin:widgets/discount/details/before"

export const DiscountDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof discountLoader>
  >

  const { id } = useParams()
  const { discount, isLoading } = useAdminDiscount(
    id!,
    { expand },
    {
      initialData,
    }
  )

  if (isLoading || !discount) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <DiscountGeneralSection discount={discount} />
          <DiscountConfigurationSection discount={discount} />
          <DiscountConditionsSection discount={discount} />
          <div className="flex w-full flex-col gap-y-2 xl:hidden">
            <RedemptionsSection redemptions={discount.usage_count} />
            <DetailsSection discount={discount} />
          </div>
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
          <JsonViewSection data={discount} />
        </div>
        <div className="hidden w-full max-w-[400px] flex-col gap-y-2 xl:flex">
          <RedemptionsSection redemptions={discount.usage_count} />
          <DetailsSection discount={discount} />
        </div>
      </div>
      <Outlet />
    </div>
  )
}

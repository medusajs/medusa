import { useAdminDiscount } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { DiscountGeneralSection } from "./components/discounts-general-section"
import { DiscountConfigurationSection } from "./components/discounts-configurations-section"

import { discountLoader, expand } from "./loader"
import { RedemptionsSection } from "./components/redemptions-section"
import { DetailsSection } from "./components/details-section"
import { DiscountConditionsSection } from "./components/discounts-conditions-section"

import before from "medusa-admin:widgets/discount/details/before"
import after from "medusa-admin:widgets/discount/details/after"

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
      <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-[1fr,400px]">
        <div className="flex flex-col gap-y-2">
          <DiscountGeneralSection discount={discount} />
          <DiscountConfigurationSection discount={discount} />
          <DiscountConditionsSection discount={discount} />
          <div className="flex flex-col gap-y-2 lg:hidden">
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
        <div className="hidden flex-col gap-y-2 lg:flex">
          <RedemptionsSection redemptions={discount.usage_count} />
          <DetailsSection discount={discount} />
        </div>
      </div>
      <Outlet />
    </div>
  )
}

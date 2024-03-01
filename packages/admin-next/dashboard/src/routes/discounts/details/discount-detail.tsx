import { useAdminDiscount } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { DiscountGeneralSection } from "./components/discounts-general-section"
import { DiscountConfigurationSection } from "./components/discounts-configurations-section"

import { discountLoader } from "./loader"
import { RedemptionsSection } from "./components/redemptions-section"
import { DetailsSection } from "./components/details-section"

export const DiscountDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof discountLoader>
  >

  const { id } = useParams()
  const { discount, isLoading } = useAdminDiscount(id!, {
    initialData,
  })

  if (isLoading || !discount) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid grid-cols-1 gap-x-4 xl:grid-cols-[1fr,400px]">
        <div className="flex flex-col gap-y-2">
          <DiscountGeneralSection discount={discount} />
          <DiscountConfigurationSection discount={discount} />
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

import { Route, Routes } from "react-router-dom"

import { PriceListEdit } from "./edit"
import { PriceListNew } from "./new"
import { PriceListOverview } from "./overview"
import WarningCircleIcon from "../../components/fundamentals/icons/warning-circle"
import { useFeatureFlag } from "../../providers/feature-flag-provider"

const PriceListRoute = () => {
  const { isFeatureEnabled } = useFeatureFlag()

  console.log(isFeatureEnabled("isolate_pricing_domain"))

  if (!isFeatureEnabled("isolate_pricing_domain")) {
    return (
      <Routes>
        <Route index element={<PriceListOverview />} />
        <Route path="new" element={<PriceListNew />} />
        <Route path=":id" element={<PriceListEdit />} />
      </Routes>
    )
  }

  return (
    <div className="flex w-full justify-center">
      <div className="rounded-rounded p-base bg-yellow-10 border-yellow-40 gap-x-small flex justify-start border">
        <div>
          <WarningCircleIcon
            size={20}
            fillType="solid"
            className="text-yellow-60"
          />
        </div>
        <div className="text-yellow-60 inter-small-regular w-full pr-[20px]">
          <h1 className="inter-base-semibold mb-2xsmall">Feature disabled</h1>
          <p className="mb-small">
            Price lists are disabled when the price module integration is
            enabled. You can enable price lists by disabling the price module.
          </p>
          <p className="mb-small">
            We are working on integrating price lists and enable both features.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PriceListRoute

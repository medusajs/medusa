import HeroPricing from "../../components/Pricing/HeroPricing"
import { notFound } from "next/navigation"
import FeatureSections from "../../components/Pricing/FeatureSections"
import { H2, Hr } from "docs-ui"
import { isPricingAvailable, loadPricingData } from "../../utils/pricing"

export default async function PricingPage() {
  if (!isPricingAvailable()) {
    return (
      <div>Pricing page is not available in the CI / Preview environment.</div>
    )
  }
  const data = await loadPricingData()

  if (!data) {
    return notFound()
  }

  return (
    <div>
      <H2 id="cloud-plans">Cloud Plans</H2>
      <HeroPricing data={data.heroPricing} />
      <Hr />
      <H2 id="plans-features">Plans Features</H2>
      <FeatureSections
        featureSections={data.featureTable.featureSections}
        columnCount={data.featureTable.columnHeaders.length}
        columns={data.featureTable.columnHeaders}
      />
    </div>
  )
}

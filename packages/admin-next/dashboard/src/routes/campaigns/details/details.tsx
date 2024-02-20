import { Container, Heading } from "@medusajs/ui"

import after from "medusa-admin:widgets/product_category/details/after"
import before from "medusa-admin:widgets/product_category/details/before"

export const CampaignDetails = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}

      <Container>
        <Heading>Campaign</Heading>
      </Container>

      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
    </div>
  )
}

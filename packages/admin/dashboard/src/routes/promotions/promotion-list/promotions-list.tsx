import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { PromotionListTable } from "./components/promotion-list-table"

export const PromotionsList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("promotion.list.before"),
        after: getWidgets("promotion.list.after"),
      }}
    >
      <PromotionListTable />
    </SingleColumnPage>
  )
}

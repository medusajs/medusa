import { useAdminDraftOrder } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { DraftOrderCustomerSection } from "./components/draft-order-customer-section"
import { DraftOrderGeneralSection } from "./components/draft-order-general-section"
import { DraftOrderSummarySection } from "./components/draft-order-summary-section"
import { draftOrderLoader } from "./loader"

export const DraftOrderDetail = () => {
  const { id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof draftOrderLoader>
  >

  const { draft_order, isLoading, isError, error } = useAdminDraftOrder(id!, {
    initialData,
  })

  if (isLoading || !draft_order) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 xl:grid-cols-[1fr,400px]">
      <div className="flex flex-col gap-y-2">
        <DraftOrderGeneralSection draftOrder={draft_order} />
        <DraftOrderSummarySection draftOrder={draft_order} />
        <div className="flex flex-col gap-y-2 xl:hidden">
          <DraftOrderCustomerSection draftOrder={draft_order} />
        </div>
        <JsonViewSection data={draft_order} />
      </div>
      <div className="hidden flex-col gap-y-2 xl:flex">
        <DraftOrderCustomerSection draftOrder={draft_order} />
      </div>
      <Outlet />
    </div>
  )
}

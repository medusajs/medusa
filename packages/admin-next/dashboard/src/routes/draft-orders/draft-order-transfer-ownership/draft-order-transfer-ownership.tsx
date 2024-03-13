import { useAdminDraftOrder } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { TransferDraftOrderOwnershipForm } from "./components/transfer-draft-order-ownership-form"

export const DraftOrderTransferOwnership = () => {
  const { id } = useParams()

  const { draft_order, isLoading, isError, error } = useAdminDraftOrder(id!)

  const ready = !isLoading && draft_order

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header></RouteDrawer.Header>
      {ready && <TransferDraftOrderOwnershipForm draftOrder={draft_order} />}
    </RouteDrawer>
  )
}

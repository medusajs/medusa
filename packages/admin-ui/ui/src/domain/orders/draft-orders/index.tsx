import { useMemo, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import Spacer from "../../../components/atoms/spacer"

import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import TableViewHeader from "../../../components/organisms/custom-table-header"
import DraftOrderTable from "../../../components/templates/draft-order-table"
import NewOrderFormProvider from "../new/form"
import NewOrder from "../new/new-order"
import DraftOrderDetails from "./details"

const VIEWS = ["orders", "drafts"]

const DraftOrderIndex = () => {
  const navigate = useNavigate()

  const view = "drafts"
  const [showNewOrder, setShowNewOrder] = useState(false)

  const actions = useMemo(() => {
    return [
      {
        label: "Create draft order",
        onClick: () => setShowNewOrder(true),
        icon: <PlusIcon size={20} />,
      },
    ]
  }, [view])

  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          customHeader={
            <TableViewHeader
              views={VIEWS}
              setActiveView={(v) => {
                if (v === "orders") {
                  navigate(`/a/orders`)
                }
              }}
              activeView={view}
            />
          }
          actionables={actions}
          className="h-fit"
        >
          <DraftOrderTable />
        </BodyCard>
        <Spacer />
      </div>
      {showNewOrder && (
        <NewOrderFormProvider>
          <NewOrder onDismiss={() => setShowNewOrder(false)} />
        </NewOrderFormProvider>
      )}
    </div>
  )
}

const DraftOrders = () => {
  return (
    <Routes>
      <Route index element={<DraftOrderIndex />} />
      <Route path="/:id" element={<DraftOrderDetails />} />
    </Routes>
  )
}

export default DraftOrders

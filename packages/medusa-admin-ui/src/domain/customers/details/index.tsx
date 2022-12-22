import { useAdminCustomer } from "medusa-react"
import moment from "moment"
import { useState } from "react"
import { useParams } from "react-router-dom"
import Avatar from "../../../components/atoms/avatar"
import Spinner from "../../../components/atoms/spinner"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import StatusDot from "../../../components/fundamentals/status-indicator"
import Actionables, {
  ActionType,
} from "../../../components/molecules/actionables"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import RawJSON from "../../../components/organisms/raw-json"
import CustomerOrdersTable from "../../../components/templates/customer-orders-table"
import EditCustomerModal from "./edit"

const CustomerDetail = () => {
  const { id } = useParams()

  const { customer, isLoading } = useAdminCustomer(id!)
  const [showEdit, setShowEdit] = useState(false)

  const customerName = () => {
    if (customer?.first_name && customer?.last_name) {
      return `${customer.first_name} ${customer.last_name}`
    } else {
      return customer?.email
    }
  }

  const actions: ActionType[] = [
    {
      label: "Edit",
      onClick: () => setShowEdit(true),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete (not implemented yet)",
      onClick: () => console.log("TODO: delete customer"),
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  return (
    <div>
      <Breadcrumb
        currentPage={"Customer Details"}
        previousBreadcrumb={"Customers"}
        previousRoute="/a/customers"
      />
      <BodyCard className={"relative mb-4 h-auto w-full pt-[100px]"}>
        <div className="from-fuschia-20 absolute inset-x-0 top-0 z-0 h-[120px] w-full bg-gradient-to-b" />
        <div className="flex grow flex-col overflow-y-auto">
          <div className="mb-4 h-[64px] w-[64px]">
            <Avatar
              user={customer}
              font="inter-2xlarge-semibold"
              color="bg-fuschia-40"
            />
          </div>
          <div className="flex items-center justify-between">
            <h1 className="inter-xlarge-semibold text-grey-90 max-w-[50%] truncate">
              {customerName()}
            </h1>
            <Actionables actions={actions} />
          </div>
          <h3 className="inter-small-regular text-grey-50 pt-1.5">
            {customer?.email}
          </h3>
        </div>
        <div className="mt-6 flex space-x-6 divide-x">
          <div className="flex flex-col">
            <div className="inter-smaller-regular text-grey-50 mb-1">
              First seen
            </div>
            <div>{moment(customer?.created_at).format("DD MMM YYYY")}</div>
          </div>
          <div className="flex flex-col pl-6">
            <div className="inter-smaller-regular text-grey-50 mb-1">Phone</div>
            <div className="max-w-[200px] truncate">
              {customer?.phone || "N/A"}
            </div>
          </div>
          <div className="flex flex-col pl-6">
            <div className="inter-smaller-regular text-grey-50 mb-1">
              Orders
            </div>
            <div>{customer?.orders.length}</div>
          </div>
          <div className="h-100 flex flex-col pl-6">
            <div className="inter-smaller-regular text-grey-50 mb-1">User</div>
            <div className="h-50 flex items-center justify-center">
              <StatusDot
                variant={customer?.has_account ? "success" : "danger"}
                title={customer?.has_account ? "True" : "False"}
              />
            </div>
          </div>
        </div>
      </BodyCard>
      <BodyCard
        title={`Orders (${customer?.orders.length})`}
        subtitle="An overview of Customer Orders"
      >
        {isLoading || !customer ? (
          <div className="pt-2xlarge flex w-full items-center justify-center">
            <Spinner size={"large"} variant={"secondary"} />
          </div>
        ) : (
          <div className="mt-large flex  grow flex-col pt-2">
            <CustomerOrdersTable id={customer.id} />
          </div>
        )}
      </BodyCard>
      <div className="mt-large">
        <RawJSON data={customer} title="Raw customer" rootName="customer" />
      </div>

      {showEdit && customer && (
        <EditCustomerModal
          customer={customer}
          handleClose={() => setShowEdit(false)}
        />
      )}
    </div>
  )
}

export default CustomerDetail

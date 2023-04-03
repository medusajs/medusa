import { useAdminCustomer } from "medusa-react"
import moment from "moment"
import { useState } from "react"
import { useParams } from "react-router-dom"
import Avatar from "../../../components/atoms/avatar"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import StatusDot from "../../../components/fundamentals/status-indicator"
import Actionables, {
  ActionType,
} from "../../../components/molecules/actionables"
import BodyCard from "../../../components/organisms/body-card"
import RawJSON from "../../../components/organisms/raw-json"
import Section from "../../../components/organisms/section"
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
  ]

  return (
    <div>
      <BackButton
        label="Back to Customers"
        path="/a/customers"
        className="mb-xsmall"
      />
      <div className="gap-y-xsmall flex flex-col">
        <Section>
          <div className="flex w-full items-start justify-between">
            <div className="gap-x-base flex w-full items-center">
              <div className="h-[64px] w-[64px]">
                <Avatar
                  user={customer}
                  font="inter-2xlarge-semibold w-full h-full"
                  color="bg-fuschia-40"
                />
              </div>
              <div className="flex grow flex-col">
                <h1 className="inter-xlarge-semibold text-grey-90 max-w-[50%] truncate">
                  {customerName()}
                </h1>
                <h3 className="inter-small-regular text-grey-50">
                  {customer?.email}
                </h3>
              </div>
            </div>
            <Actionables actions={actions} forceDropdown />
          </div>
          <div className="mt-6 flex space-x-6 divide-x">
            <div className="flex flex-col">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                First seen
              </div>
              <div>{moment(customer?.created_at).format("DD MMM YYYY")}</div>
            </div>
            <div className="flex flex-col pl-6">
              <div className="inter-smaller-regular text-grey-50 mb-1">
                Phone
              </div>
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
              <div className="inter-smaller-regular text-grey-50 mb-1">
                User
              </div>
              <div className="h-50 flex items-center justify-center">
                <StatusDot
                  variant={customer?.has_account ? "success" : "danger"}
                  title={customer?.has_account ? "Registered" : "Guest"}
                />
              </div>
            </div>
          </div>
        </Section>
        <BodyCard
          title={`Orders (${customer?.orders.length})`}
          subtitle="An overview of Customer Orders"
        >
          {isLoading || !customer ? (
            <div className="pt-2xlarge flex w-full items-center justify-center">
              <Spinner size={"large"} variant={"secondary"} />
            </div>
          ) : (
            <div className="flex  grow flex-col">
              <CustomerOrdersTable id={customer.id} />
            </div>
          )}
        </BodyCard>

        <RawJSON data={customer} title="Raw customer" />
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

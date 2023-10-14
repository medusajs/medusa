import { CustomerGroup } from "@medusajs/medusa"
import { difference } from "lodash"
import {
  useAdminAddCustomersToCustomerGroup,
  useAdminCustomerGroup,
  useAdminCustomerGroupCustomers,
  useAdminDeleteCustomerGroup,
  useAdminRemoveCustomersFromCustomerGroup,
} from "medusa-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import WidgetContainer from "../../../components/extensions/widget-container"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../components/molecules/actionables"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import CustomersListTable from "../../../components/templates/customer-group-table/customers-list-table"
import EditCustomersTable from "../../../components/templates/customer-group-table/edit-customers-table"
import useQueryFilters from "../../../hooks/use-query-filters"
import useToggleState from "../../../hooks/use-toggle-state"
import { useWidgets } from "../../../providers/widget-provider"
import { getErrorStatus } from "../../../utils/get-error-status"
import CustomerGroupModal from "./customer-group-modal"

/**
 * Default filtering config for querying customer group customers list endpoint.
 */
const defaultQueryProps = {
  additionalFilters: { expand: "groups" },
  limit: 15,
  offset: 0,
}

/*
 * Placeholder for the customer groups list.
 */
function CustomersListPlaceholder() {
  const { t } = useTranslation()

  return (
    <div className="center flex h-full min-h-[756px] items-center justify-center">
      <span className="text-xs text-gray-400">
        {t(
          "groups-no-customers-in-this-group-yet",
          "No customers in this group yet"
        )}
      </span>
    </div>
  )
}

type CustomerGroupCustomersListProps = { group: CustomerGroup }

/*
 * Customer groups list container.
 */
function CustomerGroupCustomersList(props: CustomerGroupCustomersListProps) {
  const groupId = props.group.id

  // toggle to show/hide "edit customers" modal
  const [showCustomersModal, setShowCustomersModal] = useState(false)

  const { t } = useTranslation()

  const { q, queryObject, paginate, setQuery } =
    useQueryFilters(defaultQueryProps)

  const {
    customers = [],
    isLoading,
    count,
  } = useAdminCustomerGroupCustomers(groupId, queryObject, {
    keepPreviousData: true,
  })

  const { mutate: addCustomers } = useAdminAddCustomersToCustomerGroup(groupId)
  const { mutate: removeCustomers } =
    useAdminRemoveCustomersFromCustomerGroup(groupId)

  // list of currently selected customers of a group
  const [selectedCustomerIds, setSelectedCustomerIds] = useState(
    customers.map((c) => c.id)
  )

  useEffect(() => {
    if (!isLoading) {
      setSelectedCustomerIds(customers.map((c) => c.id))
    }
  }, [isLoading, customers])

  const showPlaceholder = !isLoading && !customers.length && !q

  const actions = [
    {
      label: "Edit customers",
      onClick: () => setShowCustomersModal(true),
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  /*
   * Calculate which customers need to be added/removed.
   */
  const calculateDiff = () => {
    const initialIds = customers.map((c) => c.id)
    return {
      toAdd: difference(selectedCustomerIds, initialIds),
      toRemove: difference(initialIds, selectedCustomerIds),
    }
  }

  /**
   * Handle "edit customers" modal form submit.
   */
  const handleSubmit = () => {
    const { toAdd, toRemove } = calculateDiff()

    if (toAdd.length) {
      addCustomers({ customer_ids: toAdd.map((i) => ({ id: i })) })
    }
    if (toRemove.length) {
      removeCustomers({ customer_ids: toRemove.map((i) => ({ id: i })) })
    }

    setShowCustomersModal(false)
  }

  return (
    <BodyCard
      title={t("groups-customers", "Customers")}
      actionables={actions}
      className="min-h-[756px] w-full"
    >
      {showCustomersModal && (
        <EditCustomersTable
          selectedCustomerIds={selectedCustomerIds}
          setSelectedCustomerIds={setSelectedCustomerIds}
          handleSubmit={handleSubmit}
          onClose={() => setShowCustomersModal(false)}
        />
      )}

      {showPlaceholder ? (
        <CustomersListPlaceholder />
      ) : (
        <CustomersListTable
          query={q}
          count={count || 0}
          paginate={paginate}
          setQuery={setQuery}
          customers={customers}
          groupId={props.group.id}
          queryObject={queryObject}
          removeCustomers={removeCustomers}
        />
      )}
    </BodyCard>
  )
}

type CustomerGroupDetailsHeaderProps = {
  customerGroup: CustomerGroup
}

/*
 * Customers groups details page header.
 */
function CustomerGroupDetailsHeader(props: CustomerGroupDetailsHeaderProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const { t } = useTranslation()
  const navigate = useNavigate()

  const { mutate: deleteGroup } = useAdminDeleteCustomerGroup(
    props.customerGroup.id
  )

  const { state, close, open } = useToggleState()

  const actions: ActionType[] = [
    {
      label: t("groups-edit", "Edit"),
      onClick: open,
      icon: <EditIcon size={20} />,
    },
    {
      label: t("groups-delete", "Delete"),
      onClick: () => {
        setShowDeleteConfirmation(true)
      },
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  const onDeleteConfirmed = async () => {
    deleteGroup()
    navigate("/a/customers/groups")
  }

  const handleConfirmDialogClose = () => setShowDeleteConfirmation(false)

  return (
    <>
      <BodyCard
        title={props.customerGroup.name}
        actionables={actions}
        className="min-h-0 w-full"
        subtitle={" "}
      />
      {showDeleteConfirmation && (
        <DeletePrompt
          onDelete={onDeleteConfirmed}
          handleClose={handleConfirmDialogClose}
          confirmText={t("groups-yes-delete", "Yes, delete")}
          heading={t("groups-delete-the-group", "Delete the group")}
          successText={t("groups-group-deleted", "Group deleted")}
          text={t(
            "groups-confirm-delete-customer-group",
            "Are you sure you want to delete this customer group?"
          )}
        />
      )}
      <CustomerGroupModal
        open={state}
        onClose={close}
        customerGroup={props.customerGroup}
      />
    </>
  )
}

/*
 * Customer groups details page
 */
function CustomerGroupDetails() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { customer_group, isLoading, error } = useAdminCustomerGroup(id!)
  const { getWidgets } = useWidgets()

  if (error) {
    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // Let the error boundary handle the error
    throw error
  }

  if (isLoading || !customer_group) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <div className="-mt-4 pb-4">
      <BackButton
        path="/a/customers/groups"
        label={t("groups-back-to-customer-groups", "Back to customer groups")}
        className="mb-4"
      />
      <div className="gap-y-xsmall flex flex-col">
        {getWidgets("customer_group.details.before").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              entity={customer_group}
              injectionZone="customer_group.details.before"
              widget={w}
            />
          )
        })}

        <CustomerGroupDetailsHeader customerGroup={customer_group} />

        {getWidgets("customer_group.details.after").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              entity={customer_group}
              injectionZone="customer_group.details.after"
              widget={w}
            />
          )
        })}
        <CustomerGroupCustomersList group={customer_group} />
      </div>
    </div>
  )
}

export default CustomerGroupDetails

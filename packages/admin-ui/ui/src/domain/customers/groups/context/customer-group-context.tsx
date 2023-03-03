import React, { createContext, PropsWithChildren, useState } from "react"

import { CustomerGroup } from "@medusajs/medusa"
import {
  useAdminCreateCustomerGroup,
  useAdminUpdateCustomerGroup,
} from "medusa-react"

import CustomerGroupModal from "../customer-group-modal"
import { getErrorMessage } from "../../../../utils/error-messages"
import useNotification from "../../../../hooks/use-notification"

type CustomerGroupContextT = {
  group?: CustomerGroup
  showModal: () => void
  hideModal: () => void
}

const CustomerGroupContext = createContext<CustomerGroupContextT>()

type CustomerGroupContextContainerT = PropsWithChildren<{
  group?: CustomerGroup
}>

/*
 * A context provider which sets a display mode for `CustomerGroupModal` (create/edit)
 * and provide form data inside the context.
 */
export function CustomerGroupContextContainer(
  props: CustomerGroupContextContainerT
) {
  const notification = useNotification()

  const { mutate: createGroup } = useAdminCreateCustomerGroup()
  const { mutate: updateGroup } = useAdminUpdateCustomerGroup(props.group?.id)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)

  const handleSubmit = (data) => {
    const isEdit = !!props.group
    const method = isEdit ? updateGroup : createGroup

    const message = `Successfully ${
      isEdit ? "edited" : "created"
    } the customer group`

    method(data, {
      onSuccess: () => {
        notification("Success", message, "success")
        hideModal()
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  const context = {
    group: props.group,
    isModalVisible,
    showModal,
    hideModal,
  }

  return (
    <CustomerGroupContext.Provider value={context}>
      {props.children}

      {isModalVisible && (
        <CustomerGroupModal
          handleClose={hideModal}
          handleSubmit={handleSubmit}
          initialData={props.group}
        />
      )}
    </CustomerGroupContext.Provider>
  )
}

export default CustomerGroupContext

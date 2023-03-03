import { LineItem, OrderEdit, OrderItemChange } from "@medusajs/medusa"
import {
  useAdminCancelOrderEdit,
  useAdminConfirmOrderEdit,
  useAdminDeleteOrderEdit,
  useAdminOrderEdit,
  useAdminUser,
} from "medusa-react"
import React, { useContext } from "react"

import { OrderEditEvent } from "../../../../hooks/use-build-timeline"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import TwoStepDelete from "../../../atoms/two-step-delete"
import Button from "../../../fundamentals/button"
import EditIcon from "../../../fundamentals/icons/edit-icon"
import ImagePlaceholder from "../../../fundamentals/image-placeholder"
import EventContainer from "../event-container"
import { OrderEditContext } from "../../../../domain/orders/edit/context"
import CopyToClipboard from "../../../atoms/copy-to-clipboard"
import { ByLine } from "."

type EditCreatedProps = {
  event: OrderEditEvent
}

enum OrderEditItemChangeType {
  ITEM_ADD = "item_add",
  ITEM_REMOVE = "item_remove",
  ITEM_UPDATE = "item_update",
}

const getInfo = (edit: OrderEdit): { type: string; user_id: string } => {
  if (edit.requested_at && edit.requested_by) {
    return {
      type: "requested",
      user_id: edit.requested_by,
    }
  }
  return {
    type: "created",
    user_id: edit.created_by,
  }
}

const EditCreated: React.FC<EditCreatedProps> = ({ event }) => {
  const { isModalVisible, showModal, setActiveOrderEdit } = useContext(
    OrderEditContext
  )

  const { order_edit: orderEdit, isFetching } = useAdminOrderEdit(event.edit.id)

  const { type, user_id } = getInfo(orderEdit || event.edit)

  const notification = useNotification()

  const name = `Order Edit ${type}`

  const { user } = useAdminUser(user_id)

  const forceConfirmDialog = useImperativeDialog()

  const deleteOrderEdit = useAdminDeleteOrderEdit(event.edit.id)
  const cancelOrderEdit = useAdminCancelOrderEdit(event.edit.id)
  const confirmOrderEdit = useAdminConfirmOrderEdit(event.edit.id)

  const onDeleteOrderEditClicked = () => {
    deleteOrderEdit.mutate(undefined, {
      onSuccess: () => {
        notification("Success", `Successfully deleted Order Edit`, "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  const onCancelOrderEditClicked = () => {
    cancelOrderEdit.mutate(undefined, {
      onSuccess: () => {
        notification("Success", `Successfully canceled Order Edit`, "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  const onConfirmEditClicked = async () => {
    const shouldDelete = await forceConfirmDialog({
      heading: "Delete Confirm",
      text:
        "By force confirming you allow the order edit to be fulfilled. You will still have to reconcile payments manually after confirming.",
      confirmText: "Yes, Force Confirm",
      cancelText: "No, Cancel",
    })

    if (shouldDelete) {
      confirmOrderEdit.mutate(undefined, {
        onSuccess: () => {
          notification(
            "Success",
            `Successfully confirmed Order Edit`,
            "success"
          )
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onCopyConfirmationLinkClicked = () => {
    console.log("TODO")
  }

  const onContinueEdit = () => {
    setActiveOrderEdit(orderEdit.id)
    showModal()
  }

  // hide last created edit while editing and prevent content flashing while loading
  if ((isModalVisible && orderEdit?.status === "created") || isFetching) {
    return null
  }

  return (
    <>
      <EventContainer
        title={name}
        icon={<EditIcon size={20} />}
        time={event.time}
        isFirst={event.first}
        midNode={<ByLine user={user} />}
      >
        {orderEdit.internal_note && (
          <div className="px-base py-small mt-base mb-large rounded-large bg-grey-10 inter-base-regular text-grey-90">
            {orderEdit.internal_note}
          </div>
        )}
        <div>
          <OrderEditChanges orderEdit={orderEdit} />
        </div>
        {(orderEdit.status === "created" ||
          orderEdit.status === "requested") && (
          <div className="space-y-xsmall mt-large">
            {type === "created" ? (
              <>
                <Button
                  className="w-full border border-grey-20"
                  size="small"
                  variant="ghost"
                  onClick={onContinueEdit}
                >
                  Continue order edit
                </Button>
                <TwoStepDelete
                  onDelete={onDeleteOrderEditClicked}
                  className="w-full border border-grey-20"
                >
                  Delete the order edit
                </TwoStepDelete>
              </>
            ) : (
              <>
                <Button
                  className="w-full border border-grey-20"
                  size="small"
                  variant="ghost"
                  onClick={onCopyConfirmationLinkClicked}
                >
                  Copy Confirmation-Request Link
                </Button>
                <Button
                  className="w-full border border-grey-20"
                  size="small"
                  variant="ghost"
                  onClick={onConfirmEditClicked}
                >
                  Force Confirm
                </Button>

                <TwoStepDelete
                  onDelete={onCancelOrderEditClicked}
                  className="w-full border border-grey-20"
                >
                  Cancel Order Edit
                </TwoStepDelete>
              </>
            )}
          </div>
        )}
      </EventContainer>
    </>
  )
}

const OrderEditChanges = ({ orderEdit }) => {
  if (!orderEdit) {
    return <></>
  }
  const added = orderEdit.changes.filter(
    (oec: OrderItemChange) =>
      oec.type === OrderEditItemChangeType.ITEM_ADD ||
      (oec.type === OrderEditItemChangeType.ITEM_UPDATE &&
        oec.line_item &&
        oec.original_line_item &&
        oec.original_line_item.quantity < oec.line_item.quantity)
  )

  const removed = orderEdit.changes.filter(
    (oec) =>
      oec.type === OrderEditItemChangeType.ITEM_REMOVE ||
      (oec.type === OrderEditItemChangeType.ITEM_UPDATE &&
        oec.line_item &&
        oec.original_line_item &&
        oec.original_line_item.quantity > oec.line_item.quantity)
  )

  return (
    <div className="flex flex-col gap-y-base">
      {added.length > 0 && (
        <div>
          <span className="inter-small-regular text-grey-50">Added</span>
          {added.map((change) => (
            <OrderEditChangeItem change={change} key={change.id} />
          ))}
        </div>
      )}
      {removed.length > 0 && (
        <div>
          <span className="inter-small-regular text-grey-50">Removed</span>
          {removed.map((change) => (
            <OrderEditChangeItem change={change} key={change.id} />
          ))}
        </div>
      )}
    </div>
  )
}

type OrderEditChangeItemProps = {
  change: OrderItemChange
}

const OrderEditChangeItem: React.FC<OrderEditChangeItemProps> = ({
  change,
}) => {
  let quantity
  const isAdd = change.type === OrderEditItemChangeType.ITEM_ADD

  if (isAdd) {
    quantity = (change.line_item as LineItem).quantity
  } else {
    quantity =
      (change.original_line_item as LineItem)?.quantity -
      (change.line_item as LineItem)?.quantity
  }

  quantity = Math.abs(quantity)

  const lineItem = isAdd ? change.line_item : change.original_line_item

  return (
    <div className="flex gap-x-base mt-xsmall">
      <div>
        <div className="flex h-[40px] w-[30px] rounded-rounded overflow-hidden">
          {lineItem?.thumbnail ? (
            <img src={lineItem.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="inter-small-semibold text-grey-90">
          {quantity > 1 && <>{quantity}x</>} {lineItem?.title} &nbsp;
          {lineItem?.variant?.sku && (
            <CopyToClipboard value={lineItem?.variant?.sku} iconSize={14} />
          )}
        </span>
        <span className="flex inter-small-regular text-grey-50">
          {lineItem?.variant?.options?.map((option) => option.value)}
        </span>
      </div>
    </div>
  )
}

export default EditCreated

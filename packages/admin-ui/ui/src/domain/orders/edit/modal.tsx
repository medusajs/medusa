import React, { useContext, useEffect, useRef, useState } from "react"
import { Order, OrderEdit, ProductVariant } from "@medusajs/medusa"
import {
  useAdminCreateOrderEdit,
  useAdminDeleteOrderEdit,
  useAdminOrderEditAddLineItem,
  useAdminRequestOrderEditConfirmation,
  useAdminUpdateOrderEdit,
} from "medusa-react"
import clsx from "clsx"

import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import OrderEditLine from "../details/order-line/edit"
import VariantsTable from "./variants-table"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import { formatAmountWithSymbol } from "../../../utils/prices"
import InputField from "../../../components/molecules/input"
import useNotification from "../../../hooks/use-notification"
import { OrderEditContext } from "./context"

type TotalsSectionProps = {
  amountPaid: number
  newTotal: number
  differenceDue: number
  currencyCode: string
}

/**
 * Totals section displaying order and order edit subtotals.
 */
function TotalsSection(props: TotalsSectionProps) {
  const { currencyCode, amountPaid, newTotal, differenceDue } = props

  return (
    <>
      <div className="bg-grey-20 mb-6 h-px w-full" />
      <div className="mb-2 flex h-[40px] justify-between">
        <span className="text-gray-500">Amount Paid</span>
        <span className="text-gray-900">
          {formatAmountWithSymbol({
            amount: amountPaid,
            currency: currencyCode,
          })}
          <span className="text-gray-400"> {currencyCode.toUpperCase()}</span>
        </span>
      </div>

      <div className="mb-2 flex h-[40px] justify-between">
        <span className="font-semibold text-gray-900">New Total</span>
        <span className="text-2xl font-semibold">
          {formatAmountWithSymbol({
            amount: newTotal,
            currency: currencyCode,
          })}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Difference Due</span>
        <span
          className={clsx("text-gray-900", {
            "text-rose-500": differenceDue < 0,
            "text-emerald-500": differenceDue >= 0,
          })}
        >
          {formatAmountWithSymbol({
            amount: differenceDue,
            currency: currencyCode,
          })}
          <span className="text-gray-400"> {currencyCode.toUpperCase()}</span>
        </span>
      </div>

      <div className="bg-grey-20 mt-8 mb-6 h-px w-full" />
    </>
  )
}

type AddProductVariantProps = {
  regionId: string
  currencyCode: string
  customerId: string
  isReplace?: boolean
  onSubmit: (variants: ProductVariant[]) => void
}

/**
 * Add product variant modal screen
 */
export function AddProductVariant(props: AddProductVariantProps) {
  const { pop } = React.useContext(LayeredModalContext)

  const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>([])

  const onSubmit = async () => {
    // wait until onSubmit is done to reduce list jumping
    await props.onSubmit(selectedVariants)
    pop()
  }

  const onBack = () => {
    setSelectedVariants([])
    pop()
  }

  return (
    <>
      <Modal.Content>
        <div className="flex min-h-[680px] flex-col justify-between">
          <VariantsTable
            regionId={props.regionId}
            customerId={props.customerId}
            currencyCode={props.currencyCode}
            isReplace={!!props.isReplace}
            setSelectedVariants={setSelectedVariants}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="space-x-xsmall flex w-full justify-end">
          <Button variant="secondary" size="small" onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" size="small" onClick={onSubmit}>
            Save and go back
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

type OrderEditModalProps = {
  close: () => void
  orderEdit: OrderEdit
  currencyCode: string
  regionId: string
  customerId: string
  currentSubtotal: number
  paidTotal: number
  refundedTotal: number
}

/**
 * Displays layered modal for order editing.
 */
function OrderEditModal(props: OrderEditModalProps) {
  const {
    close,
    currentSubtotal,
    orderEdit,
    currencyCode,
    regionId,
    customerId,
    paidTotal,
    refundedTotal,
  } = props

  const filterRef = useRef()
  const notification = useNotification()
  const [note, setNote] = useState<string | undefined>()
  const [showFilter, setShowFilter] = useState(false)
  const [filterTerm, setFilterTerm] = useState<string>("")

  const showTotals = currentSubtotal !== orderEdit.subtotal
  const hasChanges = !!orderEdit.changes.length

  const {
    mutateAsync: requestConfirmation,
    isLoading: isRequestingConfirmation,
  } = useAdminRequestOrderEditConfirmation(orderEdit.id)

  const { mutateAsync: updateOrderEdit, isLoading: isUpdating } =
    useAdminUpdateOrderEdit(orderEdit.id)

  const { mutateAsync: deleteOrderEdit } = useAdminDeleteOrderEdit(orderEdit.id)

  const { mutateAsync: addLineItem } = useAdminOrderEditAddLineItem(
    orderEdit.id
  )

  const layeredModalContext = useContext(LayeredModalContext)

  const onSave = async () => {
    try {
      await requestConfirmation()
      if (note) {
        await updateOrderEdit({ internal_note: note })
      }

      notification("Success", "Order edit set as requested", "success")
    } catch (e) {
      notification("Error", "Failed to request confirmation", "error")
    }
    close()
  }

  const onCancel = async () => {
    // NOTE: has to be this order of ops
    await deleteOrderEdit()
    close()
  }

  useEffect(() => {
    if (showFilter) {
      filterRef.current.focus()
    }
  }, [showFilter])

  const onAddVariants = async (selectedVariants: ProductVariant[]) => {
    try {
      const promises = selectedVariants.map((v) =>
        addLineItem({ variant_id: v.id, quantity: 1 })
      )

      await Promise.all(promises)

      notification("Success", "Added successfully", "success")
    } catch (e) {
      notification("Error", "Error occurred", "error")
    }
  }

  const hideFilter = () => {
    if (showFilter) {
      setFilterTerm("")
    }
    setShowFilter((s) => !s)
  }

  let displayItems = orderEdit.items.sort(
    // @ts-ignore
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )

  if (filterTerm) {
    displayItems = displayItems.filter(
      (i) =>
        i.title.toLowerCase().includes(filterTerm) ||
        i.variant?.sku.toLowerCase().includes(filterTerm)
    )
  }

  const addProductVariantScreen = {
    title: "Add Product Variants",
    onBack: layeredModalContext.pop,
    view: (
      <AddProductVariant
        onSubmit={onAddVariants}
        customerId={customerId}
        regionId={regionId}
        currencyCode={currencyCode}
      />
    ),
  }

  return (
    <LayeredModal
      open
      isLargeModal
      handleClose={onCancel}
      context={layeredModalContext}
    >
      <Modal.Body>
        <Modal.Header handleClose={onCancel}>
          <h1 className="inter-xlarge-semibold">Edit Order</h1>
        </Modal.Header>
        <Modal.Content>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-large font-semibold text-gray-900">
              Items
            </span>
            <div className="flex items-center justify-between">
              <Button
                size="small"
                variant="ghost"
                className="border-grey-20 mr-2 h-[32px] flex-shrink-0 border text-gray-900"
                onClick={() =>
                  layeredModalContext.push(addProductVariantScreen)
                }
              >
                Add items
              </Button>
              {!showFilter && (
                <Button
                  size="small"
                  variant="secondary"
                  className={clsx("h–[32px] h-full w-[32px] flex-shrink-0", {
                    "focus:bg-grey-20": showFilter,
                  })}
                  onClick={() => setShowFilter(true)}
                >
                  <SearchIcon size={16} className="text-gray-500" />
                </Button>
              )}
              {showFilter && (
                <InputField
                  small
                  deletable
                  ref={filterRef}
                  value={filterTerm}
                  onDelete={hideFilter}
                  placeholder="Filter items..."
                  onChange={(e) => setFilterTerm(e.target.value)}
                  prefix={<SearchIcon size={14} className="text-gray-400" />}
                />
              )}
            </div>
          </div>

          {/* ITEMS */}
          {displayItems.map((oi) => (
            <OrderEditLine
              key={oi.id}
              item={oi}
              customerId={customerId}
              regionId={regionId}
              currencyCode={currencyCode}
              change={orderEdit.changes.find(
                (change) =>
                  change.line_item_id === oi.id ||
                  change.original_line_item_id === oi.id
              )}
            />
          ))}

          <div className="mt-8" />

          {/* TOTALS */}
          {showTotals && (
            <TotalsSection
              currencyCode={currencyCode}
              amountPaid={paidTotal - refundedTotal}
              newTotal={orderEdit.total}
              differenceDue={
                // TODO: more correct would be to have => diff_due = orderEdit_total_of_items_user_is_getting - paid_total + refunded_total
                orderEdit.total - paidTotal // (orderEdit_total - refunded_total) - (paidTotal - refundedTotal)
              }
            />
          )}

          {/* NOTE */}
          {hasChanges && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Note</span>
              <InputField
                className="max-w-[455px]"
                placeholder="Add a note..."
                onChange={(e) => setNote(e.target.value)}
                value={note}
              />
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              disabled={isUpdating || isRequestingConfirmation || !hasChanges}
              loading={isUpdating || isRequestingConfirmation}
              onClick={onSave}
            >
              Save and close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

type OrderEditModalContainerProps = {
  order: Order
}

let isRequestRunningFlag = false

function OrderEditModalContainer(props: OrderEditModalContainerProps) {
  const { order } = props
  const notification = useNotification()

  const { hideModal, orderEdits, activeOrderEditId, setActiveOrderEdit } =
    useContext(OrderEditContext)

  const { mutateAsync: createOrderEdit } = useAdminCreateOrderEdit()

  const orderEdit = orderEdits?.find((oe) => oe.id === activeOrderEditId)

  useEffect(() => {
    if (activeOrderEditId || isRequestRunningFlag) {
      return
    }

    isRequestRunningFlag = true

    createOrderEdit({ order_id: order.id })
      .then(({ order_edit }) => setActiveOrderEdit(order_edit.id))
      .catch(() => {
        notification(
          "Error",
          "There is already an active order edit on this order",
          "error"
        )
        hideModal()
      })
      .finally(() => (isRequestRunningFlag = false))
  }, [activeOrderEditId])

  const onClose = () => {
    // setActiveOrderEdit(undefined) -> context will unset active edit after flag toggle
    hideModal()
  }

  if (!orderEdit) {
    return null
  }

  return (
    <OrderEditModal
      close={onClose}
      orderEdit={orderEdit}
      currentSubtotal={order.subtotal}
      regionId={order.region_id}
      customerId={order.customer_id}
      currencyCode={order.currency_code}
      paidTotal={order.paid_total}
      refundedTotal={order.refunded_total}
    />
  )
}

export default OrderEditModalContainer

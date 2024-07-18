import {
  Address,
  ClaimOrder,
  Fulfillment,
  LineItem,
  Swap,
} from "@medusajs/medusa"
import {
  useAdminCancelOrder,
  useAdminCapturePayment,
  useAdminOrder,
  useAdminRegion,
  useAdminReservations,
  useAdminUpdateOrder,
} from "medusa-react"
import { useNavigate, useParams } from "react-router-dom"
import OrderEditProvider, { OrderEditContext } from "../edit/context"
import {
  DisplayTotal,
  FormattedAddress,
  FormattedFulfillment,
  FulfillmentStatusComponent,
  OrderStatusComponent,
  PaymentActionables,
  PaymentStatusComponent,
} from "./templates"

import { capitalize } from "lodash"
import moment from "moment"
import { useEffect, useMemo, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTranslation } from "react-i18next"
import Avatar from "../../../components/atoms/avatar"
import BackButton from "../../../components/atoms/back-button"
import Spacer from "../../../components/atoms/spacer"
import Spinner from "../../../components/atoms/spinner"
import Tooltip from "../../../components/atoms/tooltip"
import WidgetContainer from "../../../components/extensions/widget-container"
import Button from "../../../components/fundamentals/button"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import MailIcon from "../../../components/fundamentals/icons/mail-icon"
import RefreshIcon from "../../../components/fundamentals/icons/refresh-icon"
import TruckIcon from "../../../components/fundamentals/icons/truck-icon"
import { ActionType } from "../../../components/molecules/actionables"
import JSONView from "../../../components/molecules/json-view"
import BodyCard from "../../../components/organisms/body-card"
import RawJSON from "../../../components/organisms/raw-json"
import Timeline from "../../../components/organisms/timeline"
import { AddressType } from "../../../components/templates/address-form"
import TransferOrdersModal from "../../../components/templates/transfer-orders-modal"
import useClipboard from "../../../hooks/use-clipboard"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { useWidgets } from "../../../providers/widget-provider"
import { isoAlpha2Countries } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import extractCustomerName from "../../../utils/extract-customer-name"
import { formatAmountWithSymbol } from "../../../utils/prices"
import OrderEditModal from "../edit/modal"
import AddressModal from "./address-modal"
import CreateFulfillmentModal from "./create-fulfillment"
import SummaryCard from "./detail-cards/summary"
import EmailModal from "./email-modal"
import MarkShippedModal from "./mark-shipped"
import CreateRefundModal from "./refund"

type OrderDetailFulfillment = {
  title: string
  type: string
  fulfillment: Fulfillment
  swap?: Swap
  claim?: ClaimOrder
}

const gatherAllFulfillments = (order) => {
  if (!order) {
    return []
  }

  const all: OrderDetailFulfillment[] = []

  order.fulfillments.forEach((f, index) => {
    all.push({
      title: `Fulfillment #${index + 1}`,
      type: "default",
      fulfillment: f,
    })
  })

  if (order.claims?.length) {
    order.claims.forEach((claim) => {
      if (claim.fulfillment_status !== "not_fulfilled") {
        claim.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Claim fulfillment #${index + 1}`,
            type: "claim",
            fulfillment,
            claim,
          })
        })
      }
    })
  }

  if (order.swaps?.length) {
    order.swaps.forEach((swap) => {
      if (swap.fulfillment_status !== "not_fulfilled") {
        swap.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Swap fulfillment #${index + 1}`,
            type: "swap",
            fulfillment,
            swap,
          })
        })
      }
    })
  }

  return all
}

const OrderDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const dialog = useImperativeDialog()

  const [addressModal, setAddressModal] = useState<null | {
    address?: Address | null
    type: AddressType
  }>(null)

  const [emailModal, setEmailModal] = useState<null | {
    email: string
  }>(null)

  const { state: showTransferOrderModal, toggle: toggleTransferOrderModal } =
    useToggleState()

  const [showFulfillment, setShowFulfillment] = useState(false)
  const [showRefund, setShowRefund] = useState(false)
  const [fullfilmentToShip, setFullfilmentToShip] = useState(null)

  const { order, isLoading } = useAdminOrder(id!)

  const capturePayment = useAdminCapturePayment(id!)
  const cancelOrder = useAdminCancelOrder(id!)

  const {
    state: addressModalState,
    close: closeAddressModal,
    open: openAddressModal,
  } = useToggleState()

  const { mutate: updateOrder } = useAdminUpdateOrder(id!)

  const { region } = useAdminRegion(order?.region_id!, {
    enabled: !!order?.region_id,
  })
  const { isFeatureEnabled } = useFeatureFlag()
  const inventoryEnabled = useMemo(() => {
    return isFeatureEnabled("inventoryService")
  }, [isFeatureEnabled])

  const { reservations, refetch: refetchReservations } = useAdminReservations(
    {
      line_item_id: order?.items.map((item) => item.id),
    },
    {
      enabled: inventoryEnabled,
    }
  )

  useEffect(() => {
    if (inventoryEnabled) {
      refetchReservations()
    }
  }, [inventoryEnabled, refetchReservations])

  const navigate = useNavigate()
  const notification = useNotification()

  const [, handleCopy] = useClipboard(`${order?.display_id!}`, {
    successDuration: 5500,
    onCopied: () =>
      notification(
        t("details-success", "Success"),
        t("details-order-id-copied", "Order ID copied"),
        "success"
      ),
  })

  const [, handleCopyEmail] = useClipboard(order?.email!, {
    successDuration: 5500,
    onCopied: () =>
      notification(
        t("details-success", "Success"),
        t("details-email-copied", "Email copied"),
        "success"
      ),
  })

  // @ts-ignore
  useHotkeys("esc", () => navigate("/a/orders"))
  useHotkeys("command+i", handleCopy)

  const { getWidgets } = useWidgets()

  const handleDeleteOrder = async () => {
    const shouldDelete = await dialog({
      heading: t("details-cancel-order-heading", "Cancel order"),
      text: t(
        "details-are-you-sure-you-want-to-cancel-the-order",
        "Are you sure you want to cancel the order?"
      ),
      extraConfirmation: true,
      entityName: t("order-details-display-id", "order #{{display_id}}", {
        display_id: order.display_id,
      }),
    })

    if (!shouldDelete) {
      return
    }

    return cancelOrder.mutate(undefined, {
      onSuccess: () =>
        notification(
          t("details-success", "Success"),
          t(
            "details-successfully-canceled-order",
            "Successfully canceled order"
          ),
          "success"
        ),
      onError: (err) =>
        notification(
          t("details-error", "Error"),
          getErrorMessage(err),
          "error"
        ),
    })
  }

  const allFulfillments = gatherAllFulfillments(order)

  const customerActionables: ActionType[] = [
    {
      label: t("details-go-to-customer", "Go to Customer"),
      icon: <DetailsIcon size={"20"} />,
      onClick: () => navigate(`/a/customers/${order?.customer.id}`),
    },
    {
      label: t("details-transfer-ownership", "Transfer ownership"),
      icon: <RefreshIcon size={"20"} />,
      onClick: () => toggleTransferOrderModal(),
    },
  ]

  customerActionables.push({
    label: t("details-edit-shipping-address", "Edit Shipping Address"),
    icon: <TruckIcon size={"20"} />,
    onClick: () => {
      setAddressModal({
        address: order?.shipping_address,
        type: AddressType.SHIPPING,
      })
      openAddressModal()
    },
  })

  customerActionables.push({
    label: t("details-edit-billing-address", "Edit Billing Address"),
    icon: <DollarSignIcon size={"20"} />,
    onClick: () => {
      setAddressModal({
        address: order?.billing_address,
        type: AddressType.BILLING,
      })
      openAddressModal()
    },
  })

  if (order?.email) {
    customerActionables.push({
      label: t("details-edit-email-address", "Edit Email Address"),
      icon: <MailIcon size={"20"} />,
      onClick: () => {
        setEmailModal({
          email: order?.email,
        })
      },
    })
  }

  if (!order && isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="small" variant="secondary" />
      </div>
    )
  }

  if (!order && !isLoading) {
    navigate("/404")
  }

  const anyItemsToFulfil = order.items.some(
    (item: LineItem) => item.quantity > (item.fulfilled_quantity ?? 0)
  )

  return (
    <div>
      <OrderEditProvider orderId={id!}>
        <BackButton
          path="/a/orders"
          label={t("details-back-to-orders", "Back to Orders")}
          className="mb-xsmall"
        />
        {isLoading || !order ? (
          <BodyCard className="pt-2xlarge flex w-full items-center justify-center">
            <Spinner size={"large"} variant={"secondary"} />
          </BodyCard>
        ) : (
          <>
            <div>
              {getWidgets("order.details.before").map((widget, i) => {
                return (
                  <WidgetContainer
                    key={i}
                    injectionZone={"order.details.before"}
                    widget={widget}
                    entity={order}
                  />
                )
              })}
            </div>
            <div className="flex space-x-4">
              <div className="gap-y-base flex h-full w-7/12 flex-col">
                <BodyCard
                  className={"min-h-[200px] w-full"}
                  customHeader={
                    <Tooltip side="top" content={"Copy ID"}>
                      <button
                        className="inter-xlarge-semibold text-grey-90 active:text-violet-90 flex cursor-pointer items-center gap-x-2"
                        onClick={handleCopy}
                      >
                        #{order.display_id} <ClipboardCopyIcon size={16} />
                      </button>
                    </Tooltip>
                  }
                  subtitle={moment(order.created_at).format(
                    "D MMMM YYYY hh:mm a"
                  )}
                  status={<OrderStatusComponent status={order.status} />}
                  forceDropdown={true}
                  actionables={[
                    {
                      label: t("details-cancel-order", "Cancel Order"),
                      icon: <CancelIcon size={"20"} />,
                      variant: "danger",
                      onClick: () => handleDeleteOrder(),
                    },
                  ]}
                >
                  <div className="mt-6 flex space-x-6 divide-x">
                    <div className="flex flex-col">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        {t("details-email", "Email")}
                      </div>
                      <button
                        className="text-grey-90 active:text-violet-90 flex cursor-pointer items-center gap-x-1"
                        onClick={handleCopyEmail}
                      >
                        {order.email}
                        <ClipboardCopyIcon size={12} />
                      </button>
                    </div>
                    <div className="flex flex-col ps-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        {t("details-phone", "Phone")}
                      </div>
                      <div>{order.shipping_address?.phone || "N/A"}</div>
                    </div>
                    <div className="flex flex-col ps-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        {t("details-payment", "Payment")}
                      </div>
                      <div>
                        {order.payments
                          ?.map((p) => capitalize(p.provider_id))
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                </BodyCard>

                <SummaryCard order={order} reservations={reservations || []} />

                <BodyCard
                  className={"h-auto min-h-0 w-full"}
                  title={t("details-payment", "Payment")}
                  status={
                    <PaymentStatusComponent status={order.payment_status} />
                  }
                  customActionable={
                    <PaymentActionables
                      order={order}
                      capturePayment={capturePayment}
                      showRefundMenu={() => setShowRefund(true)}
                    />
                  }
                >
                  <div className="mt-6">
                    {order.payments.map((payment) => (
                      <div className="flex flex-col" key={payment.id}>
                        <DisplayTotal
                          currency={order.currency_code}
                          totalAmount={payment.amount}
                          totalTitle={payment.id}
                          subtitle={`${moment(payment.created_at).format(
                            "DD MMM YYYY hh:mm"
                          )}`}
                        />
                        {!!payment.amount_refunded && (
                          <div className="mt-4 flex justify-between">
                            <div className="flex">
                              <div className="text-grey-40 me-2">
                                <CornerDownRightIcon />
                              </div>
                              <div className="inter-small-regular text-grey-90">
                                {t("details-refunded", "Refunded")}
                              </div>
                            </div>
                            <div className="flex">
                              <div className="inter-small-regular text-grey-90 me-3">
                                -
                                {formatAmountWithSymbol({
                                  amount: payment.amount_refunded,
                                  currency: order.currency_code,
                                })}
                              </div>
                              <div className="inter-small-regular text-grey-50">
                                {order.currency_code.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="mt-4 flex justify-between">
                      <div className="inter-small-semibold text-grey-90">
                        {t("details-total-paid", "Total Paid")}
                      </div>
                      <div className="flex">
                        <div className="inter-small-semibold text-grey-90 me-3">
                          {formatAmountWithSymbol({
                            amount: order.paid_total - order.refunded_total,
                            currency: order.currency_code,
                          })}
                        </div>
                        <div className="inter-small-regular text-grey-50">
                          {order.currency_code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </BodyCard>
                <BodyCard
                  className={"h-auto min-h-0 w-full"}
                  title={t("details-fulfillment", "Fulfillment")}
                  status={
                    <FulfillmentStatusComponent
                      status={order.fulfillment_status}
                    />
                  }
                  customActionable={
                    order.status !== "canceled" &&
                    anyItemsToFulfil && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => setShowFulfillment(true)}
                      >
                        {t("details-create-fulfillment", "Create Fulfillment")}
                      </Button>
                    )
                  }
                >
                  <div className="mt-6">
                    {order.shipping_methods.map((method) => (
                      <div className="flex flex-col" key={method.id}>
                        <span className="inter-small-regular text-grey-50">
                          {t("details-shipping-method", "Shipping Method")}
                        </span>
                        <span className="inter-small-regular text-grey-90 mt-2">
                          {method?.shipping_option?.name || ""}
                        </span>
                        <div className="mt-4 flex w-full flex-grow items-center">
                          <JSONView data={method?.data} />
                        </div>
                      </div>
                    ))}
                    <div className="inter-small-regular mt-6 ">
                      {allFulfillments.map((fulfillmentObj, i) => (
                        <FormattedFulfillment
                          key={i}
                          order={order}
                          fulfillmentObj={fulfillmentObj}
                          setFullfilmentToShip={setFullfilmentToShip}
                        />
                      ))}
                    </div>
                  </div>
                </BodyCard>
                <BodyCard
                  className={"h-auto min-h-0 w-full"}
                  title={t("details-customer", "Customer")}
                  actionables={customerActionables}
                >
                  <div className="mt-6">
                    <div className="flex w-full items-center space-x-4">
                      <div className="flex h-[40px] w-[40px] ">
                        <Avatar
                          user={order.customer}
                          font="inter-large-semibold"
                          color="bg-fuschia-40"
                        />
                      </div>
                      <div>
                        <h1 className="inter-large-semibold text-grey-90">
                          {extractCustomerName(order)}
                        </h1>
                        {order.shipping_address && (
                          <span className="inter-small-regular text-grey-50">
                            {order.shipping_address.city},{" "}
                            {
                              isoAlpha2Countries[
                                order.shipping_address.country_code?.toUpperCase()
                              ]
                            }
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-6 divide-x">
                      <div className="flex flex-col">
                        <div className="inter-small-regular text-grey-50 mb-1">
                          {t("details-contact", "Contact")}
                        </div>
                        <div className="inter-small-regular flex flex-col">
                          <span>{order.email}</span>
                          <span>{order.shipping_address?.phone || ""}</span>
                        </div>
                      </div>
                      <FormattedAddress
                        title={t("details-shipping", "Shipping")}
                        addr={order.shipping_address}
                      />
                      <FormattedAddress
                        title={t("details-billing", "Billing")}
                        addr={order.billing_address}
                      />
                    </div>
                  </div>
                </BodyCard>
                <div>
                  {getWidgets("order.details.after").map((widget, i) => {
                    return (
                      <WidgetContainer
                        key={i}
                        injectionZone={"order.details.after"}
                        widget={widget}
                        entity={order}
                      />
                    )
                  })}
                </div>
                <RawJSON
                  data={order}
                  title={t("details-raw-order", "Raw order")}
                />
                <Spacer />
              </div>
              <Timeline orderId={order.id} />
            </div>

            <AddressModal
              onClose={closeAddressModal}
              open={addressModalState}
              onSave={updateOrder}
              address={addressModal?.address || undefined}
              type={addressModal?.type}
              allowedCountries={region?.countries}
            />

            {emailModal && (
              <EmailModal
                handleClose={() => setEmailModal(null)}
                email={emailModal.email}
                orderId={order.id}
              />
            )}
            {showFulfillment && (
              <CreateFulfillmentModal
                orderToFulfill={order as any}
                handleCancel={() => setShowFulfillment(false)}
                orderId={order.id}
                onComplete={inventoryEnabled ? refetchReservations : () => {}}
              />
            )}
            {showRefund && (
              <CreateRefundModal
                order={order}
                onDismiss={() => setShowRefund(false)}
              />
            )}
            {showTransferOrderModal && (
              <TransferOrdersModal
                order={order}
                onDismiss={toggleTransferOrderModal}
              />
            )}
            {fullfilmentToShip && (
              <MarkShippedModal
                handleCancel={() => setFullfilmentToShip(null)}
                fulfillment={fullfilmentToShip}
                orderId={order.id}
              />
            )}
            <OrderEditContext.Consumer>
              {({ isModalVisible }) =>
                isModalVisible && <OrderEditModal order={order} />
              }
            </OrderEditContext.Consumer>
          </>
        )}
      </OrderEditProvider>
    </div>
  )
}

export default OrderDetails

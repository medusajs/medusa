import { Order } from "@medusajs/medusa/dist/models"
import { capitalize, sum } from "lodash"
import moment from "moment"
import React, { Dispatch, ReactNode, SetStateAction, useMemo } from "react"
import Avatar from "../../../components/atoms/avatar"
import CopyToClipboard from "../../../components/atoms/copy-to-clipboard"
import Spinner from "../../../components/atoms/spinner"
import Tooltip from "../../../components/atoms/tooltip"
import Badge from "../../../components/fundamentals/badge"
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import Timeline from "../../../components/organisms/timeline"
import useClipboard from "../../../hooks/use-clipboard"
import { formatAmountWithSymbol } from "../../../utils/prices"
import { useBasePath } from "../../../utils/routePathing"
import OrderLine from "./order-line"
import useNotification from "../../../hooks/use-notification"
import Button from "../../../components/fundamentals/button"
import {
  DisplayTotal,
  FormattedAddress,
  FormattedFulfillment,
  FulfillmentStatusComponent,
  OrderStatusComponent,
  PaymentActionables,
  PaymentDetails,
  PaymentStatusComponent,
} from "./templates"
import { OrderDetailFulfillment } from "."
import { useAdminCapturePayment } from "medusa-react"
import SubOrderTable from "./sub-orders"
import { DateTime } from "luxon"
import { useSelectedVendor } from "../../../context/vendor"
import { CustomerResponses } from "./customer-responses/CustomerResponses"
import { useNavigate } from "react-router-dom"

type DetailLayoutProps = {
  id: string
  order: Order
  isLoading: boolean
  allFulfillments: OrderDetailFulfillment[]
  customerActionables: {
    label: string
    // eslint-disable-next-line no-undef
    icon: ReactNode
    onClick: () => void
  }[]
  setShowRefund: (value: React.SetStateAction<boolean>) => void
  setFulfillmentToShip: Dispatch<SetStateAction<null>>
  handleDeleteOrder: () => Promise<void>
}

const DetailLayout: React.FC<DetailLayoutProps> = ({
  id,
  order,
  isLoading,
  allFulfillments,
  customerActionables,
  handleDeleteOrder,
  setShowRefund,
  setFulfillmentToShip,
}) => {
  const navigate = useNavigate()
  const { isVendorView } = useSelectedVendor()
  const basePath = useBasePath()
  const capturePayment = useAdminCapturePayment(id)
  const notification = useNotification()
  const containsModifiedFulfillments = order?.children?.some((child) =>
    ["partially_fulfilled", "fulfilled"].some(
      (fulfillmentStatus) => fulfillmentStatus === child.fulfillment_status
    )
  )

  const vendorDisplayName = isVendorView
    ? null
    : order?.vendor?.name
    ? `${order.vendor.name}`
    : order.children?.map((o) => o.vendor?.name).join(", ")

  const filteredFulfillments = useMemo(
    () =>
      allFulfillments
        .filter((f) => !f.fulfillment.canceled_at)
        .sort(
          (a, b) =>
            DateTime.fromISO(b.fulfillment.created_at) -
            DateTime.fromISO(a.fulfillment.created_at)
        ),
    [allFulfillments]
  )

  const remainingItemsToFulfill = useMemo(
    () =>
      order?.items.reduce(
        (acc, item) => acc + item.quantity - item.fulfilled_quantity,
        0
      ),
    [order?.items]
  )

  const [, handleCopyEmail] = useClipboard(order?.email!, {
    successDuration: 5500,
    onCopied: () => notification("Success", "Email copied", "success"),
  })

  const { hasMovements, swapAmount, manualRefund, swapRefund, returnRefund } =
    useMemo(() => {
      let manualRefund = 0
      let swapRefund = 0
      let returnRefund = 0

      const swapAmount = sum(order?.swaps.map((s) => s.difference_due) || [0])

      if (order?.refunds?.length) {
        order.refunds.forEach((ref) => {
          if (ref.reason === "other" || ref.reason === "discount") {
            manualRefund += ref.amount
          }
          if (ref.reason === "return") {
            returnRefund += ref.amount
          }
          if (ref.reason === "swap") {
            swapRefund += ref.amount
          }
        })
      }
      return {
        hasMovements:
          swapAmount + manualRefund + swapRefund + returnRefund !== 0,
        swapAmount,
        manualRefund,
        swapRefund,
        returnRefund,
      }
    }, [order])

  return (
    <>
      <Breadcrumb
        currentPage={"Order Details"}
        previousBreadcrumb={"Orders"}
        previousRoute={`${basePath}/orders`}
      />
      {isLoading || !order ? (
        <BodyCard className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </BodyCard>
      ) : (
        <div className="flex space-x-4">
          <div className="flex flex-col w-7/12 h-full">
            {/* Clients */}
            <BodyCard
              className={"w-full mb-4 min-h-[200px]"}
              title="Order Details"
              subtitle={moment(order.created_at).format("DD MMMM YYYY hh:mm a")}
              status={<OrderStatusComponent status={order?.status} />}
              forceDropdown={true}
              actionables={
                containsModifiedFulfillments
                  ? []
                  : [
                      {
                        label: "Cancel Order",
                        icon: <CancelIcon size={"20"} />,
                        variant: "danger",
                        onClick: () => handleDeleteOrder(),
                      },
                    ]
              }
            >
              <div className="flex mt-6 space-x-6 divide-x overflow-scroll">
                <div className="flex flex-col">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Id
                  </div>
                  <div>#{order?.display_id}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Email
                  </div>
                  <button
                    className="text-grey-90 active:text-violet-90 cursor-pointer gap-x-1 flex items-center"
                    onClick={handleCopyEmail}
                  >
                    {order?.email}
                    <ClipboardCopyIcon size={12} />
                  </button>
                </div>
                <div className="flex flex-col pl-6 min-w-[120px]">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Phone
                  </div>
                  <div>{order?.shipping_address?.phone || "N/A"}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Payment
                  </div>
                  <div>
                    {order?.payments
                      ?.map((p) => capitalize(p.provider_id))
                      .join(", ")}
                  </div>
                </div>
                {vendorDisplayName && (
                  <div className="flex flex-col pl-6 min-w-[140px]">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                      Vendor(s)
                    </div>
                    <div>{vendorDisplayName}</div>
                  </div>
                )}
              </div>
            </BodyCard>

            {/* Summary */}
            <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Summary">
              <div className="mt-6">
                {order?.items?.map((item, i) => (
                  <OrderLine
                    key={i}
                    item={item}
                    // region={order?.region}
                    currencyCode={order?.currency_code}
                  />
                ))}
                <DisplayTotal
                  currency={order?.currency_code}
                  totalAmount={order?.subtotal}
                  totalTitle={"Subtotal"}
                />
                {order?.discounts?.map((discount, index) => (
                  <DisplayTotal
                    key={index}
                    currency={order?.currency_code}
                    totalAmount={-1 * order?.discount_total}
                    totalTitle={
                      <div className="flex inter-small-regular text-grey-90 items-center">
                        Discount:{" "}
                        <Badge className="ml-3" variant="default">
                          {discount.code}
                        </Badge>
                      </div>
                    }
                  />
                ))}
                {order?.gift_cards?.map((giftCard, index) => (
                  <DisplayTotal
                    key={index}
                    currency={order?.currency_code}
                    totalAmount={-1 * order?.gift_card_total}
                    totalTitle={
                      <div className="flex inter-small-regular text-grey-90 items-center">
                        Gift card:{" "}
                        <Badge className="ml-3" variant="default">
                          {giftCard.code}
                        </Badge>
                        <div className="ml-2">
                          <CopyToClipboard
                            value={giftCard.code}
                            showValue={false}
                            iconSize={16}
                          />
                        </div>
                      </div>
                    }
                  />
                ))}
                <DisplayTotal
                  currency={order?.currency_code}
                  totalAmount={order?.shipping_total}
                  totalTitle={"Shipping"}
                />
                <DisplayTotal
                  currency={order?.currency_code}
                  totalAmount={order?.tax_total}
                  totalTitle={`Tax`}
                />
                <DisplayTotal
                  variant={"large"}
                  currency={order?.currency_code}
                  totalAmount={order?.total}
                  totalTitle={hasMovements ? "Original Total" : "Total"}
                />
                <PaymentDetails
                  manualRefund={manualRefund}
                  swapAmount={swapAmount}
                  swapRefund={swapRefund}
                  returnRefund={returnRefund}
                  paidTotal={order?.paid_total}
                  refundedTotal={order?.refunded_total}
                  currency={order?.currency_code}
                />
              </div>
            </BodyCard>

            {/* SubOrders */}
            {!!order?.children && !!order.children.length && (
              <BodyCard
                className={"w-full mb-4 min-h-0 h-auto"}
                title="Sub Orders"
              >
                <SubOrderTable orderParentId={order.id} />
              </BodyCard>
            )}

            {/* Customer Responses */}
            <CustomerResponses items={order.items} />

            {/* Payments */}
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Payment"
              status={<PaymentStatusComponent status={order?.payment_status} />}
              customActionable={
                <PaymentActionables
                  order={order}
                  capturePayment={capturePayment}
                  showRefundMenu={() => setShowRefund(true)}
                />
              }
            >
              <div className="mt-6">
                {order?.payments.map((payment) => (
                  <div className="flex flex-col">
                    <DisplayTotal
                      currency={order?.currency_code}
                      totalAmount={payment?.amount}
                      totalTitle={payment.id}
                      subtitle={`${moment(payment?.created_at).format(
                        "DD MMM YYYY hh:mm"
                      )}`}
                    />
                    {!!payment.amount_refunded && (
                      <div className="flex justify-between mt-4">
                        <div className="flex">
                          <div className="text-grey-40 mr-2">
                            <CornerDownRightIcon />
                          </div>
                          <div className="inter-small-regular text-grey-90">
                            Refunded
                          </div>
                        </div>
                        <div className="flex">
                          <div className="inter-small-regular text-grey-90 mr-3">
                            -
                            {formatAmountWithSymbol({
                              amount: payment?.amount_refunded,
                              currency: order?.currency_code,
                            })}
                          </div>
                          <div className="inter-small-regular text-grey-50">
                            {order?.currency_code.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <div className="inter-small-semibold text-grey-90">
                    Total Paid
                  </div>
                  <div className="flex">
                    <div className="inter-small-semibold text-grey-90 mr-3">
                      {formatAmountWithSymbol({
                        amount: order?.paid_total - order?.refunded_total,
                        currency: order?.currency_code,
                      })}
                    </div>
                    <div className="inter-small-regular text-grey-50">
                      {order?.currency_code.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </BodyCard>

            {/* Fulfillments */}
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Fulfillments"
              status={
                <FulfillmentStatusComponent
                  status={order?.fulfillment_status}
                />
              }
              customActionable={
                order.status !== "canceled" &&
                remainingItemsToFulfill > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() =>
                        navigate(
                          `${basePath}/orders/${order.id}/fulfillments/manual/create`
                        )
                      }
                    >
                      Manually Fulfill Items
                    </Button>
                    {!!order.vendor_id && (
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          navigate(
                            `${basePath}/orders/${order.id}/shipping-labels/create`
                          )
                        }
                      >
                        Create Shipping Label
                      </Button>
                    )}
                  </div>
                )
              }
            >
              <div className="flex flex-col gap-y-8 divide-y">
                <div className="pt-6">
                  <div className="flex gap-6 divide-x">
                    {order?.shipping_methods.map((method) => (
                      <div className="flex flex-col">
                        <span className="inter-small-regular text-grey-50">
                          Shipping Method
                        </span>
                        <span className="inter-small-regular text-grey-90 mt-2">
                          {method.shipping_option?.name ?? method?.data?.name}
                        </span>
                      </div>
                    ))}

                    {remainingItemsToFulfill > 0 && (
                      <div className="flex flex-col pl-6">
                        <span className="inter-small-regular text-grey-50">
                          Items to Fulfill
                        </span>
                        <span className="inter-small-regular text-grey-90 mt-2">
                          {remainingItemsToFulfill}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {filteredFulfillments.length > 0 && (
                  <div>
                    <div className="inter-small-regular flex flex-col gap-y-8 divide-y">
                      {filteredFulfillments.map((fulfillmentObj, i) => (
                        <FormattedFulfillment
                          key={fulfillmentObj.fulfillment.id}
                          order={order}
                          fulfillmentObj={fulfillmentObj}
                          setFulfillmentToShip={setFulfillmentToShip}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </BodyCard>

            {/* Customer */}
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Customer"
              actionables={customerActionables}
            >
              <div>
                <div className="flex w-full space-x-4 items-center">
                  <div className="flex w-[40px] h-[40px] ">
                    <Avatar
                      user={order?.customer}
                      font="inter-large-semibold"
                      color="bg-fuschia-40"
                    />
                  </div>
                  <h3 className="inter-large-semibold text-grey-90">
                    {`${order?.shipping_address?.first_name} ${order?.shipping_address?.last_name}`}
                  </h3>
                </div>
                <div className="flex mt-6 space-x-6 divide-x">
                  <div className="flex flex-col">
                    <div className="inter-small-regular text-grey-50 mb-1">
                      Contact
                    </div>
                    <div className="flex flex-col inter-small-regular">
                      <span>{order?.email}</span>
                      <span>{order?.shipping_address?.phone || ""}</span>
                    </div>
                  </div>
                  <FormattedAddress
                    title={"Shipping"}
                    addr={order?.shipping_address}
                  />
                  <FormattedAddress
                    title={"Billing"}
                    addr={order?.billing_address}
                  />
                </div>
              </div>
            </BodyCard>
          </div>
          <Timeline orderId={order.id} />
        </div>
      )}
    </>
  )
}

export default DetailLayout

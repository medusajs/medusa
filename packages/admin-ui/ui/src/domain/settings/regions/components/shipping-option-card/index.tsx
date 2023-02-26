import { ShippingOption } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminDeleteShippingOption } from "medusa-react"
import React from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import FastDeliveryIcon from "../../../../../components/fundamentals/icons/fast-delivery-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import Actionables from "../../../../../components/molecules/actionables"
import useNotification from "../../../../../hooks/use-notification"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../../../utils/error-messages"
import { stringDisplayPrice } from "../../../../../utils/prices"
import EditModal from "./edit-modal"

type Props = {
  option: ShippingOption
}

enum ShippingOptionPriceType {
  FLAT_RATE = "flat_rate",
  CALCULATED = "calculated",
}

const ShippingOptionCard = ({ option }: Props) => {
  const { state, toggle, close } = useToggleState()
  const { mutate } = useAdminDeleteShippingOption(option.id)

  const notification = useNotification()

  const handleDeleteOption = () => {
    mutate(undefined, {
      onSuccess: () => {
        notification("Success", "Shipping option has been deleted", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <>
      <div className="bg-grey-0 rounded-rounded border border-grey-20 p-base flex items-center justify-between">
        <div className="flex items-center gap-x-base">
          <div className="bg-grey-10 p-2.5 rounded-rounded flex items-center justify-center h-10 w-10">
            <FastDeliveryIcon size={20} className="text-grey-50" />
          </div>
          <div>
            <p className="inter-base-semibold">{option.name}</p>
            <div>
              <p className="inter-small-regular text-grey-50">
                {option.price_type === ShippingOptionPriceType.FLAT_RATE
                  ? "Flat Rate"
                  : "Calcualted"}
                :{" "}
                {stringDisplayPrice({
                  amount: option.amount,
                  currencyCode: option.region.currency_code,
                })}{" "}
                - Min. subtotal:{" "}
                {stringDisplayPrice({
                  amount: option.requirements?.find(
                    (r) => r.type === "min_subtotal"
                  )?.amount,
                  currencyCode: option.region.currency_code,
                })}{" "}
                - Max. subtotal:{" "}
                {stringDisplayPrice({
                  amount: option.requirements?.find(
                    (r) => r.type === "max_subtotal"
                  )?.amount,
                  currencyCode: option.region.currency_code,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-base">
          <div
            className={clsx("py-0.5 px-xsmall rounded-rounded", {
              "bg-grey-10 text-grey-50": option.admin_only,
              "bg-emerald-10 text-emerald-50": !option.admin_only,
            })}
          >
            <span className="inter-small-semibold">
              {option.admin_only ? "Admin" : "Store"}
            </span>
          </div>
          <div>
            <Actionables
              actions={[
                {
                  label: "Edit",
                  onClick: toggle,
                  icon: <EditIcon size={20} />,
                },
                {
                  label: "Delete",
                  onClick: handleDeleteOption,
                  icon: <TrashIcon size={20} />,
                  variant: "danger",
                },
              ]}
            />
          </div>
        </div>
      </div>
      <EditModal option={option} open={state} onClose={close} />
    </>
  )
}

export default ShippingOptionCard

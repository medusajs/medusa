import { ShippingOption } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminDeleteShippingOption } from "medusa-react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const { state, toggle, close } = useToggleState()
  const { mutate } = useAdminDeleteShippingOption(option.id)

  const notification = useNotification()

  const handleDeleteOption = () => {
    mutate(undefined, {
      onSuccess: () => {
        notification(
          t("shipping-option-card-success", "Success"),
          t(
            "shipping-option-card-shipping-option-has-been-deleted",
            "Shipping option has been deleted"
          ),
          "success"
        )
      },
      onError: (error) => {
        notification(
          t("shipping-option-card-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      },
    })
  }

  return (
    <>
      <div className="bg-grey-0 rounded-rounded border-grey-20 p-base flex items-center justify-between border">
        <div className="gap-x-base flex items-center">
          <div className="bg-grey-10 rounded-rounded flex h-10 w-10 items-center justify-center p-2.5">
            <FastDeliveryIcon size={20} className="text-grey-50" />
          </div>
          <div>
            <p className="inter-base-semibold">{option.name}</p>
            <div>
              <p className="inter-small-regular text-grey-50">
                {option.price_type === ShippingOptionPriceType.FLAT_RATE
                  ? t("shipping-option-card-flat-rate", "Flat Rate")
                  : t("shipping-option-card-calcualted", "Calcualted")}
                :{" "}
                {stringDisplayPrice({
                  amount: option.amount,
                  currencyCode: option.region.currency_code,
                })}{" "}
                - {t("shipping-option-card-min-subtotal", "Min. subtotal:")}{" "}
                {stringDisplayPrice({
                  amount: option.requirements?.find(
                    (r) => r.type === "min_subtotal"
                  )?.amount,
                  currencyCode: option.region.currency_code,
                })}{" "}
                - {t("shipping-option-card-max-subtotal", "Max. subtotal:")}{" "}
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
        <div className="gap-x-base flex items-center">
          <div
            className={clsx("px-xsmall rounded-rounded py-0.5", {
              "bg-grey-10 text-grey-50": option.admin_only,
              "bg-emerald-10 text-emerald-50": !option.admin_only,
            })}
          >
            <span className="inter-small-semibold">
              {option.admin_only
                ? t("shipping-option-card-admin", "Admin")
                : t("shipping-option-card-store", "Store")}
            </span>
          </div>
          <div>
            <Actionables
              actions={[
                {
                  label: t("shipping-option-card-edit", "Edit"),
                  onClick: toggle,
                  icon: <EditIcon size={20} />,
                },
                {
                  label: t("shipping-option-card-delete", "Delete"),
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

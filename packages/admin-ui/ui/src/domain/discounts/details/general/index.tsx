import { Discount } from "@medusajs/medusa"
import { useAdminDeleteDiscount, useAdminUpdateDiscount } from "medusa-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Badge from "../../../../components/fundamentals/badge"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../components/molecules/actionables"
import StatusSelector from "../../../../components/molecules/status-selector"
import BodyCard from "../../../../components/organisms/body-card"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import useToggleState from "../../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import EditGeneral from "./edit-general"
import { TFunction } from "i18next"

type GeneralProps = {
  discount: Discount
}

const General: React.FC<GeneralProps> = ({ discount }) => {
  const { t } = useTranslation()
  const dialog = useImperativeDialog()
  const navigate = useNavigate()
  const notification = useNotification()
  const updateDiscount = useAdminUpdateDiscount(discount.id)
  const deletediscount = useAdminDeleteDiscount(discount.id)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: t("Delete Promotion"),
      text: t("Are you sure you want to delete this promotion?"),
    })
    if (shouldDelete) {
      deletediscount.mutate(undefined, {
        onSuccess: () => {
          notification(
            t("Success"),
            t("Promotion deleted successfully"),
            "success"
          )
          navigate("/a/discounts/")
        },
        onError: (err) => {
          notification(t("Error"), getErrorMessage(err), "error")
        },
      })
    }
  }

  const onStatusChange = async () => {
    updateDiscount.mutate(
      {
        is_disabled: !discount.is_disabled,
      },
      {
        onSuccess: ({ discount: { is_disabled } }) => {
          notification(
            t("Success"),
            !is_disabled
              ? t(`Discount published successfully`)
              : t(`Discount drafted successfully`),
            "success"
          )
        },
        onError: (err) => {
          notification(t("Error"), getErrorMessage(err), "error")
        },
      }
    )
  }

  const { state, open, close } = useToggleState()

  const actionables: ActionType[] = [
    {
      label: t("Edit general information"),
      onClick: open,
      icon: <EditIcon size={20} />,
    },
    {
      label: t("Delete discount"),
      onClick: onDelete,
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  return (
    <>
      <BodyCard
        actionables={actionables}
        title={discount.code}
        subtitle={discount.rule.description}
        forceDropdown
        className="min-h-[200px]"
        status={
          <div className="gap-x-2xsmall flex items-center">
            {discount.is_dynamic && (
              <span>
                <Badge variant="default">
                  <span className="text-grey-90 inter-small-regular">
                    {t("Template discount")}
                  </span>
                </Badge>
              </span>
            )}
            <StatusSelector
              isDraft={discount?.is_disabled}
              activeState={t("Published")}
              draftState={t("Draft")}
              onChange={onStatusChange}
            />
          </div>
        }
      >
        <div className="flex">
          <div className="border-grey-20 border-l pl-6">
            {getPromotionDescription(discount, t)}
            <span className="inter-small-regular text-grey-50">
              {t("Discount Amount")}
            </span>
          </div>
          <div className="border-grey-20 ml-12 border-l pl-6">
            <h2 className="inter-xlarge-regular text-grey-90">
              {discount.regions.length.toLocaleString("en-US")}
            </h2>
            <span className="inter-small-regular text-grey-50">
              {t("Valid Regions")}
            </span>
          </div>
          <div className="border-grey-20 ml-12 border-l pl-6">
            <h2 className="inter-xlarge-regular text-grey-90">
              {discount.usage_count.toLocaleString("en-US")}
            </h2>
            <span className="inter-small-regular text-grey-50">
              {t("Total Redemptions")}
            </span>
          </div>
        </div>
      </BodyCard>

      <EditGeneral discount={discount} onClose={close} open={state} />
    </>
  )
}

const getPromotionDescription = (discount: Discount, t: TFunction) => {
  switch (discount.rule.type) {
    case "fixed":
      return (
        <div className="flex items-baseline">
          <h2 className="inter-xlarge-regular">
            {formatAmountWithSymbol({
              currency: discount.regions[0].currency_code,
              amount: discount.rule.value,
            })}
          </h2>
          <span className="inter-base-regular text-grey-50 ml-1">
            {discount.regions[0].currency_code.toUpperCase()}
          </span>
        </div>
      )
    case "percentage":
      return (
        <div className="flex items-baseline">
          <h2 className="inter-xlarge-regular text-grey-90">
            {discount.rule.value}
          </h2>
          <span className="inter-base-regular text-grey-50 ml-1">%</span>
        </div>
      )
    case "free_shipping":
      return (
        <h2 className="inter-xlarge-regular text-grey-90">
          {t(`FREE SHIPPING`)}
        </h2>
      )
    default:
      return t("Unknown discount type")
  }
}

export default General

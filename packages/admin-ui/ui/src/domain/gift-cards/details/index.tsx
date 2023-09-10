import { useAdminGiftCard, useAdminUpdateGiftCard } from "medusa-react"
import moment from "moment"
import { useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import WidgetContainer from "../../../components/extensions/widget-container"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import StatusSelector from "../../../components/molecules/status-selector"
import BodyCard from "../../../components/organisms/body-card"
import RawJSON from "../../../components/organisms/raw-json"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { useWidgets } from "../../../providers/widget-provider"
import { getErrorMessage } from "../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../utils/prices"
import EditGiftCardModal from "./edit-gift-card-modal"
import UpdateBalanceModal from "./update-balance-modal"
import { useTranslation } from "react-i18next"

const GiftCardDetails = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { gift_card: giftCard, isLoading } = useAdminGiftCard(id!, {
    enabled: !!id,
  })

  const updateGiftCard = useAdminUpdateGiftCard(giftCard?.id!)

  const { getWidgets } = useWidgets()

  const notification = useNotification()

  const {
    state: editState,
    open: openEdit,
    close: closeEdit,
  } = useToggleState()

  const {
    state: balanceState,
    open: openBalance,
    close: closeBalance,
  } = useToggleState()

  const actions = [
    {
      label: t("details-edit-details", "Edit details"),
      onClick: openEdit,
      icon: <EditIcon size={20} />,
    },
    {
      label: t("details-update-balance-label", "Update balance"),
      onClick: openBalance,
      icon: <DollarSignIcon size={20} />,
    },
  ]

  const updateStatus = (data: { is_disabled?: boolean }) => {
    updateGiftCard.mutate(
      { is_disabled: data.is_disabled },
      {
        onSuccess: () => {
          notification(
            t("details-updated-status", "Updated status"),
            t(
              "details-successfully-updated-the-status-of-the-gift-card",
              "Successfully updated the status of the Gift Card"
            ),
            "success"
          )
        },
        onError: (err) =>
          notification(
            t("details-error", "Error"),
            getErrorMessage(err),
            "error"
          ),
      }
    )
  }

  return (
    <div>
      <BackButton
        label={t("details-back-to-gift-cards", "Back to Gift Cards")}
        path="/a/gift-cards"
        className="mb-xsmall"
      />
      {isLoading || !giftCard ? (
        <div className="bg-grey-0 border-grey-20 rounded-rounded py-xlarge flex w-full items-center justify-center border">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      ) : (
        <>
          <div className="gap-y-xsmall flex flex-col">
            {getWidgets("custom_gift_card.before").map((w, i) => {
              return (
                <WidgetContainer
                  key={i}
                  widget={w}
                  entity={giftCard}
                  injectionZone="custom_gift_card.before"
                />
              )
            })}

            <BodyCard
              className={"h-auto min-h-0 w-full"}
              title={`${giftCard?.code}`}
              status={
                <StatusSelector
                  isDraft={!!giftCard?.is_disabled}
                  activeState={"Active"}
                  draftState={"Disable"}
                  onChange={() =>
                    updateStatus({ is_disabled: !giftCard.is_disabled })
                  }
                />
              }
              actionables={actions}
            >
              <div className="flex justify-between">
                <div className="flex space-x-6 divide-x">
                  <div className="flex flex-col">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                      {t("details-original-amount", "Original amount")}
                    </div>
                    <div>
                      {formatAmountWithSymbol({
                        amount: giftCard.value,
                        currency: giftCard.region.currency_code,
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                      {t("details-balance", "Balance")}
                    </div>
                    <div>
                      {formatAmountWithSymbol({
                        amount: giftCard.balance,
                        currency: giftCard.region.currency_code,
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                      {t("details-region", "Region")}
                    </div>
                    <div>{giftCard.region.name}</div>
                  </div>
                  {giftCard.ends_at && (
                    <div className="flex flex-col pl-6">
                      <div className="inter-smaller-regular text-grey-50 mb-1">
                        {t("details-expires-on", "Expires on")}
                      </div>
                      <div>
                        {moment(giftCard.ends_at).format("DD MMM YYYY")}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col pl-6">
                    <div className="inter-smaller-regular text-grey-50 mb-1">
                      {t("details-created", "Created")}
                    </div>
                    <div>
                      {moment(giftCard.created_at).format("DD MMM YYYY")}
                    </div>
                  </div>
                </div>
              </div>
            </BodyCard>

            {getWidgets("custom_gift_card.after").map((w, i) => {
              return (
                <WidgetContainer
                  key={i}
                  widget={w}
                  entity={giftCard}
                  injectionZone="custom_gift_card.after"
                />
              )
            })}

            <RawJSON
              data={giftCard}
              title={t("details-raw-gift-card", "Raw gift card")}
            />
          </div>

          <UpdateBalanceModal
            giftCard={giftCard}
            onClose={closeBalance}
            open={balanceState}
          />

          <EditGiftCardModal
            onClose={closeEdit}
            open={editState}
            giftCard={giftCard}
          />
        </>
      )}
    </div>
  )
}

export default GiftCardDetails

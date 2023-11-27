import { Product } from "@medusajs/medusa"
import {
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminStore,
  useAdminUpdateProduct,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageDescription from "../../components/atoms/page-description"
import Spacer from "../../components/atoms/spacer"
import Spinner from "../../components/atoms/spinner"
import WidgetContainer from "../../components/extensions/widget-container"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BannerCard from "../../components/molecules/banner-card"
import BodyCard from "../../components/organisms/body-card"
import DeletePrompt from "../../components/organisms/delete-prompt"
import GiftCardBanner from "../../components/organisms/gift-card-banner"
import GiftCardTable from "../../components/templates/gift-card-table"
import useNotification from "../../hooks/use-notification"
import useToggleState from "../../hooks/use-toggle-state"
import { useWidgets } from "../../providers/widget-provider"
import { ProductStatus } from "../../types/shared"
import { getErrorMessage } from "../../utils/error-messages"
import CustomGiftcard from "./custom-giftcard"
import NewGiftCard from "./new"

const Overview = () => {
  const { t } = useTranslation()
  const { products, isLoading } = useAdminProducts({
    is_giftcard: true,
  })
  const { store } = useAdminStore()
  const [showCreate, setShowCreate] = useState(false)

  const giftCard = products?.[0]

  const navigate = useNavigate()
  const notification = useNotification()
  const updateGiftCard = useAdminUpdateProduct(giftCard?.id!)
  const deleteGiftCard = useAdminDeleteProduct(giftCard?.id!)

  const {
    state: stateCustom,
    close: closeCustom,
    open: openCustom,
  } = useToggleState()

  const { state: stateNew, close: closeNew, open: openNew } = useToggleState()

  const {
    state: stateDelete,
    close: closeDelete,
    open: openDelete,
  } = useToggleState()

  const onUpdate = () => {
    let status: ProductStatus = ProductStatus.PUBLISHED
    if (giftCard?.status === "published") {
      status = ProductStatus.DRAFT
    }

    updateGiftCard.mutate(
      { status },
      {
        onSuccess: () =>
          notification(
            t("gift-cards-success", "Success"),
            t(
              "gift-cards-successfully-updated-gift-card",
              "Successfully updated Gift Card"
            ),
            "success"
          ),
        onError: (err) =>
          notification(
            t("gift-cards-error", "Error"),
            getErrorMessage(err),
            "error"
          ),
      }
    )
  }

  const onDelete = () => {
    deleteGiftCard.mutate(undefined, {
      onSuccess: () => {
        navigate("/a/gift-cards")
      },
    })
  }

  const actionables = [
    {
      label: t("gift-cards-custom-gift-card", "Custom Gift Card"),
      onClick: openCustom,
      icon: <PlusIcon size={20} />,
    },
  ]

  const giftCardWithCurrency = useMemo(() => {
    if (!giftCard || !store) {
      return null
    }

    return {
      ...(giftCard as Product),
      defaultCurrency: store.default_currency_code,
    }
  }, [giftCard, store])

  const { getWidgets } = useWidgets()

  return (
    <>
      <div className="flex flex-col">
        <PageDescription
          title={t("gift-cards-gift-cards", "Gift Cards")}
          subtitle={t(
            "gift-cards-manage",
            "Manage the Gift Cards of your Medusa store"
          )}
        />
        {!isLoading ? (
          <div className="gap-y-xsmall flex flex-col">
            {getWidgets("gift_card.list.before").map((w, i) => {
              return (
                <WidgetContainer
                  key={i}
                  widget={w}
                  injectionZone="gift_card.list.before"
                  entity={null}
                />
              )
            })}
            {giftCardWithCurrency ? (
              <GiftCardBanner
                {...giftCardWithCurrency}
                onDelete={openDelete}
                onEdit={() => navigate("/a/gift-cards/manage")}
                onUnpublish={onUpdate}
              />
            ) : (
              <BannerCard
                title={t(
                  "gift-cards-are-you-ready-to-sell-your-first-gift-card",
                  "Are you ready to sell your first Gift Card?"
                )}
              >
                <BannerCard.Description
                  cta={{
                    label: t("gift-cards-create-gift-card", "Create Gift Card"),
                    onClick: () => setShowCreate(true),
                  }}
                >
                  {t(
                    "gift-cards-no-gift-card-has-been-added-yet",
                    "No Gift Card has been added yet."
                  )}
                </BannerCard.Description>
              </BannerCard>
            )}

            <BodyCard
              title={t("gift-cards-history", "History")}
              subtitle={t(
                "gift-cards-see-the-history-of-purchased-gift-cards",
                "See the history of purchased Gift Cards"
              )}
              actionables={actionables}
            >
              <GiftCardTable />
            </BodyCard>

            {getWidgets("gift_card.list.after").map((w, i) => {
              return (
                <WidgetContainer
                  key={i}
                  widget={w}
                  injectionZone="gift_card.list.after"
                  entity={null}
                />
              )
            })}
          </div>
        ) : (
          <div className="rounded-rounded border-grey-20 flex h-44 w-full items-center justify-center border">
            <Spinner variant="secondary" size="large" />
          </div>
        )}
      </div>

      <CustomGiftcard onClose={closeCustom} open={stateCustom} />

      {showCreate && <NewGiftCard onClose={() => setShowCreate(!showCreate)} />}

      {stateDelete && (
        <DeletePrompt
          handleClose={closeDelete}
          onDelete={async () => onDelete()}
          successText={t(
            "gift-cards-successfully-deleted-gift-card",
            "Successfully deleted Gift Card"
          )}
          confirmText={t("gift-cards-yes-delete", "Yes, delete")}
          heading={t("gift-cards-delete-gift-card", "Delete Gift Card")}
        />
      )}
      <Spacer />
    </>
  )
}

export default Overview

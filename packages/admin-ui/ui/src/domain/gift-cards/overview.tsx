import {
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminStore,
  useAdminUpdateProduct,
} from "medusa-react"
import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import PageDescription from "../../components/atoms/page-description"
import Spinner from "../../components/atoms/spinner"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BannerCard from "../../components/molecules/banner-card"
import BodyCard from "../../components/organisms/body-card"
import DeletePrompt from "../../components/organisms/delete-prompt"
import GiftCardBanner from "../../components/organisms/gift-card-banner"
import GiftCardTable from "../../components/templates/gift-card-table"
import useNotification from "../../hooks/use-notification"
import { ProductStatus } from "../../types/shared"
import { getErrorMessage } from "../../utils/error-messages"
import CustomGiftcard from "./custom-giftcard"
import NewGiftCard from "./new"

const Overview = () => {
  const { products, isLoading } = useAdminProducts({
    is_giftcard: true,
  })
  const { store } = useAdminStore()
  const [showCreate, setShowCreate] = useState(false)
  const [showCreateCustom, setShowCreateCustom] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const giftCard = products?.[0]

  const navigate = useNavigate()
  const notification = useNotification()
  const updateGiftCard = useAdminUpdateProduct(giftCard?.id!)
  const deleteGiftCard = useAdminDeleteProduct(giftCard?.id!)

  const onUpdate = () => {
    let status: ProductStatus = ProductStatus.PUBLISHED
    if (giftCard?.status === "published") {
      status = ProductStatus.DRAFT
    }

    updateGiftCard.mutate(
      // @ts-ignore
      { status },
      {
        onSuccess: () =>
          notification("Success", "Successfully updated Gift Card", "success"),
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
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
      label: "Custom Gift Card",
      onClick: () => setShowCreateCustom(true),
      icon: <PlusIcon size={20} />,
    },
  ]

  const giftCardWithCurrency = useMemo(() => {
    if (!giftCard || !store) {
      return null
    }

    return { ...giftCard, defaultCurrency: store.default_currency_code }
  }, [giftCard, store])

  return (
    <>
      <div className="flex flex-col grow h-full pb-xlarge">
        <PageDescription
          title="Gift Cards"
          subtitle="Manage the Gift Cards of your Medusa store"
        />
        {!isLoading ? (
          <>
            <div className="mb-base">
              {giftCardWithCurrency ? (
                <GiftCardBanner
                  {...giftCardWithCurrency}
                  onDelete={() => setShowDelete(true)}
                  onEdit={() => navigate("/a/gift-cards/manage")}
                  onUnpublish={onUpdate}
                />
              ) : (
                <BannerCard title="Are you ready to sell your first Gift Card?">
                  <BannerCard.Description
                    cta={{
                      label: "Create Gift Card",
                      onClick: () => setShowCreate(true),
                    }}
                  >
                    No Gift Card has been added yet.
                  </BannerCard.Description>
                </BannerCard>
              )}
            </div>
            <div className="w-full flex flex-col grow">
              <BodyCard
                title="History"
                subtitle="See the history of purchased Gift Cards"
                actionables={actionables}
                className="h-fit"
              >
                <GiftCardTable />
              </BodyCard>
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-center h-44 rounded-rounded border border-grey-20">
            <Spinner variant="secondary" size="large" />
          </div>
        )}
      </div>
      {showCreateCustom && (
        <CustomGiftcard onDismiss={() => setShowCreateCustom(false)} />
      )}
      {showCreate && <NewGiftCard onClose={() => setShowCreate(!showCreate)} />}
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => onDelete()}
          successText="Successfully deleted Gift Card"
          confirmText="Yes, delete"
          heading="Delete Gift Card"
        />
      )}
    </>
  )
}

export default Overview

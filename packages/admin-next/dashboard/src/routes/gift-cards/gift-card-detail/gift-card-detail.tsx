import { useAdminGiftCard } from "medusa-react"
import { Outlet, json, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { GiftCardGeneralSection } from "./components/gift-card-general-section"

export const GiftCardDetail = () => {
  const { id } = useParams()
  const { gift_card, isLoading, isError, error } = useAdminGiftCard(id!)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !gift_card) {
    if (error) {
      throw error
    }

    throw json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <GiftCardGeneralSection giftCard={gift_card} />
      <JsonViewSection data={gift_card} />
      <Outlet />
    </div>
  )
}

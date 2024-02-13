import { useAdminGiftCard } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { GiftCardGeneralSection } from "./components/gift-card-general-section"
import { giftCardLoader } from "./loader"

export const GiftCardDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof giftCardLoader>
  >

  const { gift_card, isLoading, isError, error } = useAdminGiftCard(id!, {
    initialData,
  })

  if (isLoading || !gift_card) {
    return null
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <GiftCardGeneralSection giftCard={gift_card} />
      <JsonViewSection data={gift_card} />
      <Outlet />
    </div>
  )
}

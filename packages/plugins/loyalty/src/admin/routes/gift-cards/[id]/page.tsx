import { useParams } from "react-router-dom"
import { LayoutComposer } from "@medusajs/dashboard/components"
import { JsonViewSection } from "../../../components/json-view-section"
import { useGiftCard } from "../../../hooks/api/gift-cards"
import GiftCardBalanceSection from "./components/gift-card-balance-section"
import GiftCardGeneralSection from "./components/gift-card-general-section"
import GiftCardNoteSection from "./components/gift-card-note-section"
import GiftCardOrderSection from "./components/gift-card-order-section"
import GiftCardTransactionsSection from "./components/gift-card-transactions-section"
import { AdminGiftCard, AdminStoreCreditAccount } from "../../../../types"

type GiftCardWithStoreCreditAccount = AdminGiftCard & {
  store_credit_account: AdminStoreCreditAccount
}

const GiftCardDetailsPage = () => {
  const { id } = useParams()
  const { gift_card: giftCard, isLoading } = useGiftCard(id!, {
    fields: "*line_item.product,*store_credit_account",
  })

  if (isLoading) {
    return <>Loading</>
  }

  if (!isLoading && !giftCard) {
    return <>Gift card not found</>
  }

  const storeCreditAccount = (giftCard as GiftCardWithStoreCreditAccount)
    ?.store_credit_account

  return (
    <LayoutComposer
      widgetsZonePrefix="gift_card.details"
      preferredLayoutId="core:two-column"
      data={giftCard}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="GiftCardGeneralSection">
              <GiftCardGeneralSection giftCard={giftCard!} />
            </LayoutComposer.Entry>

            {storeCreditAccount && (
              <LayoutComposer.Entry id="GiftCardTransactionsSection">
                <GiftCardTransactionsSection
                  storeCreditAccount={storeCreditAccount}
                />
              </LayoutComposer.Entry>
            )}

            <LayoutComposer.Entry id="JsonViewSection">
              <JsonViewSection data={giftCard!} />
            </LayoutComposer.Entry>
          </>
        ),
        side: (
          <>
            {storeCreditAccount && (
              <LayoutComposer.Entry id="GiftCardBalanceSection">
                <GiftCardBalanceSection
                  storeCreditAccount={storeCreditAccount}
                  giftCard={giftCard!}
                />
              </LayoutComposer.Entry>
            )}

            <LayoutComposer.Entry id="GiftCardNoteSection">
              <GiftCardNoteSection giftCard={giftCard!} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="GiftCardOrderSection">
              <GiftCardOrderSection giftCard={giftCard!} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

export default GiftCardDetailsPage

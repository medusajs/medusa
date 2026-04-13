import { Outlet, useParams } from "react-router-dom";
import { JsonViewSection } from "../../../components/json-view-section";
import { TwoColumnLayout } from "../../../components/layouts/two-column";
import { useGiftCard } from "../../../hooks/api/gift-cards";
import GiftCardBalanceSection from "./components/gift-card-balance-section";
import GiftCardGeneralSection from "./components/gift-card-general-section";
import GiftCardNoteSection from "./components/gift-card-note-section";
import GiftCardOrderSection from "./components/gift-card-order-section";
import GiftCardTransactionsSection from "./components/gift-card-transactions-section";
import { AdminGiftCard, AdminStoreCreditAccount } from "../../../../types";

type GiftCardWithStoreCreditAccount = AdminGiftCard & {
  store_credit_account: AdminStoreCreditAccount;
};

const GiftCardDetailsPage = () => {
  const { id } = useParams();
  const { gift_card: giftCard, isLoading } = useGiftCard(id!, {
    fields: "*line_item.product,*store_credit_account",
  });

  if (isLoading) {
    return <>Loading</>;
  }

  if (!isLoading && !giftCard) {
    return <>Gift card not found</>;
  }

  const storeCreditAccount = (giftCard as GiftCardWithStoreCreditAccount)
    ?.store_credit_account;

  return (
    <>
      <TwoColumnLayout
        firstCol={
          <>
            <GiftCardGeneralSection giftCard={giftCard!} />

            {storeCreditAccount && (
              <GiftCardTransactionsSection
                storeCreditAccount={storeCreditAccount}
              />
            )}

            <JsonViewSection data={giftCard!} />
          </>
        }
        secondCol={
          <>
            {storeCreditAccount && (
              <GiftCardBalanceSection
                storeCreditAccount={storeCreditAccount}
                giftCard={giftCard!}
              />
            )}

            <GiftCardNoteSection giftCard={giftCard!} />
            <GiftCardOrderSection giftCard={giftCard!} />
          </>
        }
      />
      <Outlet />
    </>
  );
};

export default GiftCardDetailsPage;

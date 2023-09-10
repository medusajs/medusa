import { Product } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import useToggleState from "../../../hooks/use-toggle-state"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import Section from "../section"
import AddDenominationModal from "./add-denominations-modal"
import DenominationsTable from "./denominations-table"

type GiftCardDenominationsSectionProps = {
  giftCard: Product
}

const GiftCardDenominationsSection = ({
  giftCard,
}: GiftCardDenominationsSectionProps) => {
  const { t } = useTranslation()
  const {
    state: addDenomination,
    close: closeAddDenomination,
    open: openAddDenomination,
  } = useToggleState()

  return (
    <>
      <Section
        title={t(
          "gift-card-denominations-section-denominations",
          "Denominations"
        )}
        forceDropdown
        actions={[
          {
            label: t(
              "gift-card-denominations-section-add-denomination",
              "Add Denomination"
            ),
            onClick: openAddDenomination,
            icon: <PlusIcon size={20} />,
          },
        ]}
      >
        <div className="mb-large mt-base">
          <DenominationsTable denominations={[...giftCard.variants]} />
        </div>
      </Section>

      <AddDenominationModal
        giftCard={giftCard}
        open={addDenomination}
        onClose={closeAddDenomination}
      />
    </>
  )
}

export default GiftCardDenominationsSection

import { Product } from "@medusajs/medusa"
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
  const {
    state: addDenomination,
    close: closeAddDenomination,
    open: openAddDenomination,
  } = useToggleState()

  return (
    <>
      <Section
        title="Denominations"
        forceDropdown
        actions={[
          {
            label: "Add Denomination",
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

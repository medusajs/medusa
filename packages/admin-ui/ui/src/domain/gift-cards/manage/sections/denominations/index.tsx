import { Product } from "@medusajs/medusa"
import React from "react"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import AddDenominationModal from "./add-denominations-modal"
import DenominationsTable from "./denominations-table"

type DenominationsProps = {
  giftCard: Product
}

const Denominations: React.FC<DenominationsProps> = ({ giftCard }) => {
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
        <DenominationsTable denominations={[...giftCard.variants]} />
      </Section>

      <AddDenominationModal
        giftCard={giftCard}
        open={addDenomination}
        onClose={closeAddDenomination}
      />
    </>
  )
}

export default Denominations

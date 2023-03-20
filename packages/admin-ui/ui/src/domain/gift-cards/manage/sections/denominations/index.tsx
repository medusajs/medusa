import { Product } from "@medusajs/medusa"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import React, { useMemo } from "react"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import AddDenominationModal from "./add-denominations-modal"
import DenominationTable from "./denomination-table"
import { useDenominationColumns } from "./use-denominations-columns"

type DenominationsProps = {
  giftCard: Product
}

const Denominations: React.FC<DenominationsProps> = ({ giftCard }) => {
  const {
    state: addDenomination,
    close: closeAddDenomination,
    open: openAddDenomination,
  } = useToggleState()

  const columns = useDenominationColumns()

  const data = useMemo(() => giftCard.variants, [giftCard])

  const instance = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

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
        <DenominationTable instance={{ ...instance }} />
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

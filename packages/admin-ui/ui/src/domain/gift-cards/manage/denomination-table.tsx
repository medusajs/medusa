import { useAdminDeleteVariant } from "medusa-react"
import React, { useState } from "react"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Table from "../../../components/molecules/table"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import { stringDisplayPrice } from "../../../utils/prices"

type DenominationTableProps = {
  giftCardId: string
  denominations: any[]
  defaultCurrency: string
  setEditDenom: (denom) => void
}

const DenominationTable: React.FC<DenominationTableProps> = ({
  giftCardId,
  denominations,
  defaultCurrency,
  setEditDenom,
}) => {
  const [selectedDenom, setSelectedDenom] = useState<string | null>(null)

  const deleteDenomination = useAdminDeleteVariant(giftCardId)

  const getDenominationPrices = (denomination) => {
    const sortHelper = (p1, p2) => {
      const curr1 = p1.currency_code
      const curr2 = p2.currency_code

      if (curr1 < curr2) {
        return -1
      }
      if (curr1 > curr2) {
        return 1
      }
      return 0
    }

    return denomination.prices
      .filter((p) => p.currency_code !== defaultCurrency) // without default
      .sort(sortHelper) // sort by currency code
      .map((p) =>
        stringDisplayPrice({ currencyCode: p.currency_code, amount: p.amount })
      ) // get formatted price
      .join(", ") // concatenate to single comma separated string
  }

  const getDenominationRow = (denomination, index) => {
    let defaultPrice = denomination.prices.find(
      (p) => p.currency_code === defaultCurrency
    )

    if (!defaultPrice) {
      defaultPrice = denomination.prices[0]
    }

    return (
      <Table.Row
        key={`denomination-${index}`}
        color={"inherit"}
        actions={[
          {
            label: "Edit denomination",
            onClick: () => setEditDenom(denomination),
            icon: <EditIcon size={20} />,
          },
          {
            label: "Delete denomination",
            variant: "danger",
            onClick: () => setSelectedDenom(denomination.id),
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell>
          {stringDisplayPrice({
            currencyCode: defaultPrice.currency_code,
            amount: defaultPrice.amount,
          })}
        </Table.Cell>
        <Table.Cell>{getDenominationPrices(denomination)}</Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    )
  }

  const handleDeleteDenomination = async () => {
    deleteDenomination.mutateAsync(selectedDenom!)
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table>
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>Default Value</Table.HeadCell>
            <Table.HeadCell>Other Values</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body className="text-grey-90">
          {denominations?.map((d, idx) => getDenominationRow(d, idx))}
        </Table.Body>
      </Table>
      {selectedDenom && (
        <DeletePrompt
          handleClose={() => setSelectedDenom(null)}
          text="Are you sure you want to delete this denomination from your Medusa Store?"
          heading="Delete denomination"
          onDelete={() => handleDeleteDenomination()}
          successText="Successfully deleted denomination"
          confirmText="Yes, delete"
        />
      )}
    </div>
  )
}

export default DenominationTable

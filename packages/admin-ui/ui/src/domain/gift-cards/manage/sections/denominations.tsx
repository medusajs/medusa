import { Product, ProductVariant } from "@medusajs/medusa"
import {
  useAdminDeleteVariant,
  useAdminStore,
  useAdminUpdateVariant,
} from "medusa-react"
import React, { useState } from "react"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import AddDenominationModal from "../../../../components/organisms/add-denomination-modal"
import BodyCard from "../../../../components/organisms/body-card"
import EditDenominationsModal from "../../../../components/organisms/edit-denominations-modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import DenominationTable from "../denomination-table"

type DenominationsProps = {
  giftCard: Product
}

const Denominations: React.FC<DenominationsProps> = ({ giftCard }) => {
  const [editDenom, setEditDenom] = useState<Omit<
    ProductVariant,
    "beforeInsert"
  > | null>(null)
  const [addDenom, setAddDenom] = useState(false)

  const { store } = useAdminStore()
  const updateGiftCardVariant = useAdminUpdateVariant(giftCard.id)
  const deleteGiftCardVariant = useAdminDeleteVariant(giftCard.id)
  const notification = useNotification()

  const currencyCodes =
    store?.currencies
      .filter((currency) => currency.code !== store.default_currency_code)
      .map((currency) => currency.code) || []

  const submitDenomations = (denoms) => {
    if (!denoms.length) {
      // if a update would result in the variant having 0 prices, then we delete it instead
      deleteGiftCardVariant.mutate(editDenom!.id, {
        onSuccess: () => {
          notification(
            "Success",
            "Successfully updated denominations",
            "success"
          )
          setEditDenom(null)
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      })
      return
    }

    updateGiftCardVariant.mutate(
      {
        variant_id: editDenom!.id,
        prices: denoms.map(({ amount, currency_code }) => ({
          amount,
          currency_code,
        })),
        title: editDenom!.title,
        inventory_quantity: editDenom!.inventory_quantity,
        options: editDenom!.options.map((opt) => ({
          option_id: opt.option_id,
          value: opt.value,
        })),
      },
      {
        onSuccess: () => {
          notification(
            "Success",
            "Successfully updated denominations",
            "success"
          )
          setEditDenom(null)
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }
  return (
    <>
      <BodyCard
        title="Denominations"
        subtitle="Manage your denominations"
        className={"h-auto w-full"}
        actionables={[
          {
            label: "Add Denomination",
            onClick: () => setAddDenom(true),
            icon: <PlusIcon size={20} />,
          },
        ]}
      >
        <DenominationTable
          giftCardId={giftCard.id}
          denominations={giftCard.variants || []}
          defaultCurrency={store?.default_currency_code || ""}
          setEditDenom={setEditDenom}
        />
      </BodyCard>
      {editDenom && (
        <EditDenominationsModal
          currencyCodes={store?.currencies.map((c) => c.code)}
          onSubmit={submitDenomations}
          defaultDenominations={editDenom.prices.map((p) => ({
            amount: p.amount,
            currency_code: p.currency_code,
            id: p.id,
          }))}
          handleClose={() => setEditDenom(null)}
        />
      )}
      {addDenom && (
        <AddDenominationModal
          giftCard={giftCard}
          handleClose={() => setAddDenom(false)}
          storeCurrency={store?.default_currency_code!}
          currencyCodes={currencyCodes}
        />
      )}
    </>
  )
}

export default Denominations

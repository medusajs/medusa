import { MoneyAmount, ProductVariant } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminDeleteVariant, useAdminStore } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../utils/error-messages"
import { normalizeAmount } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import Actionables, { ActionType } from "../../molecules/actionables"
import EditDenominationsModal from "./edit-denominations-modal"

const columnHelper = createColumnHelper<ProductVariant>()

export const useDenominationColumns = () => {
  const { store } = useAdminStore()
  const { t } = useTranslation()

  const columns = useMemo(() => {
    if (!store) {
      return []
    }

    const defaultCurrency = store.default_currency_code

    return [
      columnHelper.display({
        header: t(
          "gift-card-denominations-section-denomination",
          "Denomination"
        ),
        id: "denomination",
        cell: ({ row }) => {
          const defaultDenomination = row.original.prices.find(
            (p) =>
              p.currency_code === defaultCurrency &&
              p.region_id === null &&
              p.price_list_id === null
          )

          return defaultDenomination ? (
            <p>
              {normalizeAmount(defaultCurrency, defaultDenomination.amount)}{" "}
              <span className="text-grey-50">
                {defaultCurrency.toUpperCase()}
              </span>
            </p>
          ) : (
            "-"
          )
        },
      }),
      columnHelper.display({
        header: t(
          "gift-card-denominations-section-in-other-currencies",
          "In other currencies"
        ),
        id: "other_currencies",
        cell: ({ row }) => {
          const otherCurrencies = row.original.prices.filter(
            (p) =>
              p.currency_code !== defaultCurrency &&
              p.region_id === null &&
              p.price_list_id === null
          )

          let remainder: MoneyAmount[] = []

          if (otherCurrencies.length > 2) {
            remainder = otherCurrencies.splice(2)
          }

          return otherCurrencies.length > 0 ? (
            <p>
              {otherCurrencies.map((p, index) => {
                return (
                  <span key={index}>
                    {normalizeAmount(p.currency_code, p.amount)}{" "}
                    <span className="text-grey-50">
                      {p.currency_code.toUpperCase()}
                    </span>
                    {index < otherCurrencies.length - 1 && ", "}
                  </span>
                )
              })}
              {remainder.length > 0 && (
                <Tooltip
                  content={
                    <ul>
                      {remainder.map((p, index) => {
                        return (
                          <li key={index}>
                            <p>
                              {normalizeAmount(p.currency_code, p.amount)}{" "}
                              <span className="text-grey-50">
                                {p.currency_code.toUpperCase()}
                              </span>
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  }
                >
                  <span className="text-grey-50 cursor-default">
                    {t(
                      "gift-card-denominations-section-and-more",
                      ", and {{count}} more",
                      { count: remainder.length }
                    )}
                  </span>
                </Tooltip>
              )}
            </p>
          ) : (
            "-"
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row: { original } }) => <Actions original={original} />,
      }),
    ]
  }, [store])

  return columns
}

const Actions = ({ original }: { original: ProductVariant }) => {
  const { t } = useTranslation()
  const { state, open, close } = useToggleState()

  const { mutateAsync } = useAdminDeleteVariant(original.product_id)
  const notification = useNotification()

  const dialog = useImperativeDialog()

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: t(
        "gift-card-denominations-section-delete-denomination",
        "Delete denomination"
      ),
      text: t(
        "gift-card-denominations-section-confirm-delete",
        "Are you sure you want to delete this denomination?"
      ),
    })

    if (shouldDelete) {
      mutateAsync(original.id, {
        onSuccess: () => {
          notification(
            t(
              "gift-card-denominations-section-denomination-deleted",
              "Denomination deleted"
            ),
            t(
              "gift-card-denominations-section-denomination-was-successfully-deleted",
              "Denomination was successfully deleted"
            ),
            "success"
          )
        },
        onError: (error) => {
          notification(
            t("gift-card-denominations-section-error", "Error"),
            getErrorMessage(error),
            "error"
          )
        },
      })
    }
  }

  const actions: ActionType[] = [
    {
      label: t("gift-card-denominations-section-edit", "Edit"),
      onClick: open,
      icon: <EditIcon size={20} />,
    },
    {
      label: t("gift-card-denominations-section-delete", "Delete"),
      onClick: onDelete,
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return (
    <>
      <div className="flex items-center justify-end">
        <Actionables actions={actions} forceDropdown />
      </div>
      <EditDenominationsModal
        open={state}
        onClose={close}
        denomination={original}
      />
    </>
  )
}

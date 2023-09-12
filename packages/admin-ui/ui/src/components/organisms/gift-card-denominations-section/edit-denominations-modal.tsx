import { MoneyAmount, ProductVariant, Store } from "@medusajs/medusa"
import { useQueryClient } from "@tanstack/react-query"
import {
  adminProductKeys,
  useAdminStore,
  useAdminUpdateVariant,
} from "medusa-react"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import DenominationForm, {
  DenominationFormType,
} from "../../forms/gift-card/denomination-form"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"

type EditDenominationsModalProps = {
  open: boolean
  onClose: () => void
  denomination: ProductVariant
}

type EditDenominationModalFormType = {
  denominations: DenominationFormType
}

const EditDenominationsModal = ({
  denomination,
  onClose,
  open,
}: EditDenominationsModalProps) => {
  const { t } = useTranslation()
  const { store } = useAdminStore()
  const { mutate, isLoading } = useAdminUpdateVariant(denomination.product_id)

  const queryClient = useQueryClient()

  const form = useForm<EditDenominationModalFormType>({
    defaultValues: getDefaultValues(store, denomination.prices),
  })

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form

  const notification = useNotification()

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(store, denomination.prices))
    }
  }, [open, store, denomination.prices, reset])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  const onSubmit = handleSubmit((data) => {
    const payload = {
      prices: [
        {
          amount: data.denominations.defaultDenomination.amount,
          currency_code: data.denominations.defaultDenomination.currency_code,
        },
      ],
    }

    data.denominations.currencyDenominations.forEach((currency) => {
      if (
        (currency.amount !== undefined && currency.amount !== null) ||
        data.denominations.useSameValue
      ) {
        payload.prices.push({
          amount: data.denominations.useSameValue
            ? data.denominations.defaultDenomination.amount
            : currency.amount,
          currency_code: currency.currency_code,
        })
      }
    })

    mutate(
      {
        variant_id: denomination.id,
        ...payload,
      },
      {
        onSuccess: () => {
          notification(
            t(
              "gift-card-denominations-section-denomination-updated",
              "Denomination updated"
            ),
            t(
              "gift-card-denominations-section-a-new-denomination-was-successfully-updated",
              "A new denomination was successfully updated"
            ),
            "success"
          )
          queryClient.invalidateQueries(adminProductKeys.all)
          handleClose()
        },
        onError: (error) => {
          notification(
            t("gift-card-denominations-section-error", "Error"),
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
  })

  return (
    <Modal open={open} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h1 className="inter-xlarge-semibold">
            {t(
              "gift-card-denominations-section-edit-denomination",
              "Edit Denomination"
            )}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <DenominationForm form={nestedForm(form, "denominations")} />
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-2xsmall flex w-full items-center justify-end">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={handleClose}
              >
                {t("gift-card-denominations-section-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={isLoading}
                disabled={!isDirty || isLoading}
              >
                {t(
                  "gift-card-denominations-section-save-and-close",
                  "Save and close"
                )}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (store: Store | undefined, prices: MoneyAmount[]) => {
  if (!store) {
    return undefined
  }

  const defaultValues = {
    denominations: {
      defaultDenomination: {
        currency_code: store.default_currency_code,
        includes_tax: store.currencies.find(
          (c) => c.code === store.default_currency_code
        )?.includes_tax,
        amount: findPrice(store.default_currency_code, prices),
      },
      currencyDenominations: store.currencies
        .filter((c) => c.code !== store.default_currency_code)
        .map((currency) => {
          return {
            currency_code: currency.code,
            includes_tax: currency.includes_tax,
            amount: findPrice(currency.code, prices),
          }
        }),
    },
  } as EditDenominationModalFormType

  if (
    defaultValues.denominations.currencyDenominations.every(
      (c) => c.amount === defaultValues.denominations.defaultDenomination.amount
    )
  ) {
    defaultValues.denominations.useSameValue = true
  }

  return defaultValues
}

const findPrice = (currencyCode: string, prices: MoneyAmount[]) => {
  return prices.find(
    (p) =>
      p.currency_code === currencyCode &&
      p.region_id === null &&
      p.price_list_id === null
  )?.amount
}

export default EditDenominationsModal

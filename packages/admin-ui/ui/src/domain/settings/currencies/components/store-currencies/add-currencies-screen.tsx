import { Currency } from "@medusajs/medusa"
import { useAdminCurrencies, useAdminUpdateStore } from "medusa-react"
import React, { useContext, useState } from "react"
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table"
import { useTranslation } from "react-i18next"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import { useEditCurrenciesModal } from "./edit-currencies-modal"
import CurrenciesTable from "./table"
import { useCurrencyColumns } from "./use-currency-table-columns"

const LIMIT = 15

const AddCurrenciesScreen = () => {
  const [offset, setOffset] = useState(0)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const { t } = useTranslation()
  const { onClose, store } = useEditCurrenciesModal()
  const { reset, pop } = useContext(LayeredModalContext)

  const { currencies, count, isLoading } = useAdminCurrencies(
    {
      limit: LIMIT,
      offset,
    },
    {
      keepPreviousData: true,
    }
  )

  const { mutate, isLoading: isMutating } = useAdminUpdateStore()
  const notification = useNotification()

  const onSubmit = (next: () => void) => {
    mutate(
      {
        currencies: [
          ...store.currencies.map((curr) => curr.code),
          ...selectedRowIds,
        ],
      },
      {
        onSuccess: () => {
          notification(
            t("store-currencies-success", "Success"),
            t(
              "store-currencies-successfully-updated-currencies",
              "Successfully updated currencies"
            ),
            "success"
          )
          next()
        },
        onError: (err) => {
          notification(
            t("store-currencies-error", "Error"),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  }

  const data = React.useMemo(() => {
    return currencies || []
  }, [currencies])

  const columns = useCurrencyColumns()

  const tableState = useTable<Currency>(
    {
      data: data,
      columns,
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / LIMIT),
        pageSize: LIMIT,
      },
      autoResetPage: false,
      autoResetSelectedRows: false,
      getRowId: (row) => row.code,
      pageCount: Math.ceil((count || 0) / LIMIT),
      defaultColumn: {
        width: "auto",
      },
    },
    useSortBy,
    usePagination,
    useRowSelect
  )

  return (
    <>
      <Modal.Content>
        <CurrenciesTable
          isLoading={isLoading}
          setQuery={() => {}}
          setSelectedRowIds={setSelectedRowIds}
          count={count || 0}
          tableState={tableState}
          setOffset={setOffset}
          offset={offset}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full items-center justify-end">
          <Button variant="secondary" size="small" onClick={pop}>
            {t("store-currencies-cancel", "Cancel")}
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() =>
              onSubmit(() => {
                pop()
              })
            }
          >
            {t("store-currencies-save-and-go-back", "Save and go back")}
          </Button>
          <Button
            variant="primary"
            size="small"
            loading={isMutating}
            disabled={isMutating}
            onClick={() =>
              onSubmit(() => {
                reset()
                onClose()
              })
            }
          >
            {t("store-currencies-save-and-close", "Save and close")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useAddCurrenciesModalScreen = () => {
  const { pop, push } = useContext(LayeredModalContext)
  const { t } = useTranslation()

  return {
    screen: {
      title: t("store-currencies-add-store-currencies", "Add Store Currencies"),
      onBack: pop,
      view: <AddCurrenciesScreen />,
    },
    push,
  }
}

export default AddCurrenciesScreen

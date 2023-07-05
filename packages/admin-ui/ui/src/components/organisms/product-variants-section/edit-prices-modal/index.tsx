import clsx from "clsx"
import React, { useEffect, useState } from "react"
import AmountField from "react-currency-input-field"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Product, ProductVariant } from "@medusajs/client-types"

import Modal from "../../../molecules/modal"
import Fade from "../../../atoms/fade-wrapper"
import Button from "../../../fundamentals/button"
import { getAllProductPricesCurrencies, getCurrencyPricesOnly } from "./utils"
import AdjustmentsIcon from "../../../fundamentals/icons/adjustments-icon"
import { useAdminCurrencies, useAdminRegions } from "medusa-react"
import CheckIcon from "../../../fundamentals/icons/check-icon"
import CrossIcon from "../../../fundamentals/icons/cross-icon"

type EditPricesActionsProps = {
  selectedCurrencies: string[]
  selectedRegions: string[]
  toggleCurrency: (currencyCode: string) => void
  toggleRegion: (regionId: string) => void
}

/**
 * Edit prices table header actions.
 */
function EditPricesActions(props: EditPricesActionsProps) {
  const { selectedCurrencies, selectedRegions, toggleCurrency, toggleRegion } =
    props

  const { regions } = useAdminRegions()
  const { currencies } = useAdminCurrencies()

  return (
    <div className="border-t py-[12px] px-4">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary" size="small" className="text-gray-700">
            View
            <AdjustmentsIcon size={20} />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          align="start"
          sideOffset={10}
          className="bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown z-30 max-h-[500px] min-w-[272px] overflow-y-scroll border"
        >
          <DropdownMenu.Label className="text-small px-[12px] py-2 font-medium text-gray-400">
            Currencies
          </DropdownMenu.Label>
          {currencies?.map((c) => (
            <DropdownMenu.Item
              key={c.code}
              onClick={(event) => {
                event.preventDefault()
                toggleCurrency(c.code)
              }}
              className="mb-1 cursor-pointer last:mb-0 hover:bg-gray-100"
            >
              <div className="flex justify-between gap-4 px-[12px] py-2 text-gray-800">
                {c.code.toUpperCase()}
                <label className="flex  items-center justify-between gap-2  text-gray-400">
                  <span className="max-w-[180px] truncate">{c.name}</span>
                  {selectedCurrencies.includes(c.code) && (
                    <CheckIcon className="text-gray-900" size={16} />
                  )}
                </label>
              </div>
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Label className="text-small border-t border-gray-200 px-[12px] py-2 font-medium text-gray-400">
            Regions
          </DropdownMenu.Label>
          {regions?.map((r) => (
            <DropdownMenu.Item className="mb-1 last:mb-0" key={r}>
              <div className="flex justify-between gap-4 px-[12px] py-2 text-gray-800">
                {r.name}
                {selectedRegions.includes(r.id) && (
                  <CheckIcon className="text-gray-900" size={16} />
                )}
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

type CurrencyCellProps = {
  currencyCode: string
  variant: ProductVariant
  editedAmount?: number
  active?: boolean
  setEditedAmount: (
    variantId: string,
    currencyCode: string,
    newAmount: string
  ) => void
  selectCell: (variantId: string, currencyCode: string) => void
  deselectCell: (variantId: string, currencyCode: string) => void
  setFocusedCell: (
    arg: { variantId: string; currencyCode: string } | undefined
  ) => void
}

/**
 * Amount cell container.
 */
function CurrencyCell(props: CurrencyCellProps) {
  const {
    variant,
    currencyCode,
    editedAmount,
    setEditedAmount,
    setFocusedCell,
    active,
    selectCell,
    deselectCell,
  } = props

  const [showDragIndicator, setShowDragIndicator] = useState(false)

  const amount =
    editedAmount ||
    getCurrencyPricesOnly(variant.prices!).find(
      (p) => p.currency_code === currencyCode
    )?.amount

  return (
    <td
      onClick={() => selectCell(variant.id, currencyCode)}
      onMouseEnter={(e) => drag && selectCell(variant.id, currencyCode)}
      onMouseLeave={(e) => drag && deselectCell(variant.id, currencyCode)}
      className={clsx("border pr-2", {
        "bg-blue-100": active,
      })}
    >
      <AmountField
        onFocus={() => setFocusedCell({ variantId: variant.id, currencyCode })}
        onBlur={() => setFocusedCell(undefined)}
        style={{ width: "100%", textAlign: "right", paddingRight: 8 }}
        className={clsx("decoration-transparent focus:outline-0", {
          "bg-blue-100": active,
        })}
        onChange={(e) =>
          setEditedAmount(
            variant.id,
            currencyCode,
            e.target.value.replace(",", "")
          )
        }
        decimalSeparator="."
        value={amount}
      ></AmountField>
    </td>
  )
}

type EditPricesTableProps = {
  product: EditPricesModalProps["product"]
  currencies: string[]
}

let drag = false

let activeCurrencyOrRegion = undefined

/**
 * Edit prices table component.
 */
function EditPricesTable(props: EditPricesTableProps) {
  const [activeEditAmount, setActiveEditAmount] = useState<number | undefined>()

  const [editedPrices, setEditedPrices] = useState({})
  const [selectedCells, setSelectedCells] = useState({})

  const setEditedAmount = (
    variantId: string,
    currencyCode: string,
    newAmount: string
  ) => {
    let amount: number | undefined = parseFloat(newAmount)

    if (isNaN(amount as number)) {
      amount = undefined
    }
    setActiveEditAmount(amount)
    const prices = { ...editedPrices }

    Object.keys(selectedCells).forEach((k) => (prices[k] = amount))
    setEditedPrices(prices)
  }

  const selectCell = (variantId: string, currencyCode: string) => {
    if (currencyCode !== activeCurrencyOrRegion) {
      return
    }

    const key = `${variantId}-${currencyCode}`
    const next = { ...selectedCells }

    next[key] = true
    setSelectedCells(next)
  }

  const deselectCell = (variantId: string, currencyCode: string) => {
    const key = `${variantId}-${currencyCode}`
    const next = { ...selectedCells }

    delete next[key]
    setSelectedCells(next)
  }

  const setFocusedCell = (props?: {
    variantId: string
    currencyCode: string
  }) => {
    if (!props) {
      activeCurrencyOrRegion = undefined
    } else {
      activeCurrencyOrRegion = props.currencyCode
      selectCell(props.variantId, props.currencyCode)
    }
  }

  useEffect(() => {
    const nextState = {}
    props.product.variants!.forEach((variant) => {
      props.currencies.forEach((c) => {
        const amount = getCurrencyPricesOnly(variant.prices!).find(
          (p) => p.currency_code === c
        )?.amount

        nextState[`${variant.id}-${c}`] = amount
      })
    })
    setEditedPrices(nextState)
  }, [props.currencies, props.product.variants])

  useEffect(() => {
    const down = () => {
      setSelectedCells({})
      drag = true
    }
    const up = () => (drag = false)

    document.addEventListener("mousedown", down)
    document.addEventListener("mouseup", up)

    return () => {
      document.removeEventListener("mousedown", down)
      document.removeEventListener("mouseup", up)
    }
  }, [])

  return (
    <div className="overflow-x-auto">
      <table
        style={{ fontSize: 13 }}
        className="w-full table-auto overflow-scroll"
      >
        <thead>
          <tr
            style={{ lineHeight: 3 }}
            className="tw-text-medusa-text-subtle h-2 text-left font-normal"
          >
            <th className="h-2 min-w-[180px] border pl-4 font-medium text-gray-400">
              Product
            </th>
            <th className="min-w-[180px] border pl-4 font-medium text-gray-400">
              SKU
            </th>
            {props.currencies.map((c) => (
              <th
                key={c}
                className="min-w-[220px] border pl-4 font-medium text-gray-400"
              >
                Price {c.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ lineHeight: 3 }}>
            <td className="border pl-4">
              <div className="text-black-800 flex items-center gap-2">
                <img
                  src={props.product.thumbnail}
                  alt="Thumbnail"
                  className="h-[22px] w-[16px] rounded"
                />
                {props.product.title}
              </div>
            </td>
            <td className="border pl-4">-</td>
            {props.currencies.map((c) => (
              <td className="border pr-4 text-right" key={c}>
                -
              </td>
            ))}
          </tr>

          {props.product.variants!.map((variant) => (
            <tr key={variant.id} style={{ lineHeight: 3 }}>
              <td className="border pl-10 text-gray-400">{variant.title}</td>
              <td className="border pl-4 text-gray-400 ">{variant.sku}</td>

              {props.currencies.map((c) => (
                <CurrencyCell
                  currencyCode={c}
                  key={variant.id + c}
                  variant={variant}
                  active={!!selectedCells[`${variant.id}-${c}`]}
                  editedAmount={editedPrices[`${variant.id}-${c}`]}
                  setEditedAmount={setEditedAmount}
                  selectCell={selectCell}
                  deselectCell={deselectCell}
                  setFocusedCell={setFocusedCell}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

type EditPricesModalProps = {
  close: () => void
  product: Product
}

/**
 * Edit prices modal container.
 */
function Index(props: EditPricesModalProps) {
  const currencies = getAllProductPricesCurrencies(props.product).sort()

  const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)
  const [selectedRegions, setSelectedRegions] = useState([])

  const toggleCurrency = (currencyCode: string) => {
    const set = new Set(selectedCurrencies)
    if (set.has(currencyCode)) {
      set.delete(currencyCode)
    } else {
      set.add(currencyCode)
    }

    setSelectedCurrencies(Array.from(set))
    console.log(selectedCurrencies)
  }

  const toggleRegion = (regionId: string) => {}

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        props.close()
      }
    }
    document.addEventListener("keydown", onEsc)

    return () => document.removeEventListener("keydown", onEsc)
  }, [])

  return (
    <Fade isFullScreen isVisible>
      <Modal.Body className="border bg-gray-200 p-2">
        <div className="h-full rounded-lg border border-gray-300 bg-white">
          <div className="flex h-[64px] items-center justify-between px-4">
            <div className="flex h-[20px] items-center gap-2">
              <Button
                variant="ghost"
                size="small"
                onClick={props.close}
                className="text-grey-50 cursor-pointer"
              >
                <CrossIcon size={20} />
              </Button>
              <span className="text-small rounded-lg border border-2 border-gray-300 bg-gray-100 px-2 font-medium text-gray-500">
                esc
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="small"
                onClick={props.close}
                className="text-black-800  cursor-pointer border p-1.5 font-medium"
              >
                Discard
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={props.close}
                className="cursor-pointer border bg-black p-1.5 font-medium text-white hover:bg-black"
              >
                Save and close
              </Button>
            </div>
          </div>
          <EditPricesActions
            selectedCurrencies={selectedCurrencies}
            selectedRegions={selectedRegions}
            toggleCurrency={toggleCurrency}
            toggleRegion={toggleRegion}
          />
          <EditPricesTable
            product={props.product}
            currencies={selectedCurrencies}
          />
        </div>
      </Modal.Body>
    </Fade>
  )
}

export default Index

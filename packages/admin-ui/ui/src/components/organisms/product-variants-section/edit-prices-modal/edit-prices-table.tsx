import React, { useEffect, useState } from "react"
import { useAdminRegions, useAdminStore } from "medusa-react"
import { Product } from "@medusajs/client-types"

import {
  getCellYMidpoint,
  getCurrencyPricesOnly,
  getRegionPricesOnly,
} from "./utils"
import CurrencyCell from "./currency-cell"
import IconBuildingTax from "../../../fundamentals/icons/building-tax-icon"
import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"
import Tooltip from "../../../atoms/tooltip"

type EditPricesTableProps = {
  product: Product
  currencies: string[]
  regions: string[]
  onPriceUpdate: (prices: Record<string, number | undefined>) => void
}

enum MoveDirection {
  Up = "UP",
  Down = "DOWN",
}

enum AnchorPosition {
  Above = "ABOVE",
  Below = "BELOW",
}

// anchor cell midpoint Y
let anchor: number | undefined = null
// last visited cell midpoint Y
let lastVisited: number | undefined = null

/**
 * During drag move keep info which column is active one
 */
let activeCurrencyOrRegion: string | undefined = undefined
/**
 * During drag move keep track of what variant has been last visited
 */
let lastVisitedVariant: string | undefined = undefined

let activeAmount: number | undefined = undefined

/**
 * Pointer for displaying highlight rectangle range
 */
let startIndex: number | undefined
let endIndex: number | undefined
let anchorIndex: number | undefined

/**
 * Temp. variable for persisting previous "editedPrices" state before editing
 * so we can undo changes.
 */
let prevPriceState: Record<string, number> | undefined = undefined

/**
 * Construct cell key.
 * Cell row is defined by variant id and column is ether currency or region.
 */
function getKey(variantId: string, currencyCode?: string, regionId?: string) {
  return `${variantId}-${currencyCode || regionId}`
}

/**
 * Edit prices table component.
 */
function EditPricesTable(props: EditPricesTableProps) {
  const { store } = useAdminStore()
  const storeCurrencies = store?.currencies
  const { regions: storeRegions } = useAdminRegions({
    limit: 1000,
  })

  const [isDrag, setIsDrag] = useState(false)
  const [editedPrices, setEditedPrices] = useState<
    Record<string, number | undefined>
  >({})
  const [selectedCells, setSelectedCells] = useState<Record<string, boolean>>(
    {}
  )

  const selectCell = (
    variantId: string,
    currencyCode?: string,
    region?: string,
    override?: boolean
  ) => {
    if ((currencyCode || region) !== activeCurrencyOrRegion) {
      return
    }

    const key = getKey(variantId, currencyCode, region)

    if (override) {
      setSelectedCells({ [key]: true })
      return
    }

    const next = { ...selectedCells }

    next[key] = true
    setSelectedCells(next)
  }

  const deselectCell = (
    variantId: string,
    currencyCode?: string,
    region?: string
  ) => {
    const key = getKey(variantId, currencyCode, region)
    const next = { ...selectedCells }

    delete next[key]
    setSelectedCells(next)
  }

  const setPriceForCell = (
    amount: number | undefined,
    variantId: string,
    currencyCode?: string,
    region?: string
  ) => {
    const next = { ...editedPrices }
    next[getKey(variantId, currencyCode, region)] = amount
    setEditedPrices(next)
  }

  const resetSelection = () => {
    anchorIndex = undefined
    startIndex = undefined
    endIndex = undefined

    anchor = undefined
    lastVisited = undefined
    lastVisitedVariant = undefined
    activeCurrencyOrRegion = undefined
    activeAmount = undefined

    // warning state updates in event handlers will be batched together so if there is another
    // `setSelectedCells` (or `resetSelection`) call in the same event handler, only last state will apply
    setSelectedCells({})
  }

  /**
   * ==================== HANDLERS ====================
   */

  const onMouseRowEnter = (event: React.MouseEvent, variantId: string) => {
    if (!isDrag || !lastVisited || !anchor) {
      return
    }

    if (variantId === lastVisitedVariant) {
      // WE LEFT THE TABLE
      lastVisited = getCellYMidpoint(event)
      return
    }

    const currentY = getCellYMidpoint(event)
    const move = currentY > lastVisited ? MoveDirection.Down : MoveDirection.Up

    const anchorPosition =
      currentY > anchor ? AnchorPosition.Above : AnchorPosition.Below

    if (
      (anchorPosition === AnchorPosition.Above &&
        move === MoveDirection.Down) ||
      (anchorPosition === AnchorPosition.Below && move === MoveDirection.Up)
    ) {
      if (move === MoveDirection.Down) {
        endIndex++
      } else if (anchor !== currentY) {
        startIndex--
      }
      selectCell(variantId, activeCurrencyOrRegion)
      setPriceForCell(activeAmount, variantId, activeCurrencyOrRegion)
    }

    if (
      anchor === currentY || // We returned to the anchor cell
      (anchorPosition === AnchorPosition.Above && move === MoveDirection.Up) ||
      (anchorPosition === AnchorPosition.Below && move === MoveDirection.Down)
    ) {
      if (move === MoveDirection.Up) {
        endIndex--
      } else {
        startIndex++
      }

      deselectCell(lastVisitedVariant, activeCurrencyOrRegion)
      setPriceForCell(
        prevPriceState[getKey(lastVisitedVariant, activeCurrencyOrRegion)],
        lastVisitedVariant,
        activeCurrencyOrRegion
      )
    }

    lastVisitedVariant = variantId
    lastVisited = getCellYMidpoint(event)
  }

  const onMouseCellClick = (
    event: React.MouseEvent,
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => {
    event.stopPropagation()

    prevPriceState = editedPrices

    // set variant row anchors
    anchor = getCellYMidpoint(event)
    lastVisited = anchor
    lastVisitedVariant = variantId

    activeCurrencyOrRegion = currencyCode || regionId
    activeAmount = Number(event.target.value?.replace(",", ""))
    selectCell(variantId, currencyCode, regionId, true)

    startIndex = props.product.variants!.findIndex((v) => v.id === variantId)
    endIndex = startIndex
    anchorIndex = startIndex
  }

  const onInputChange = (
    value: number | undefined,
    variantId: string,
    currencyCode?: string,
    regionId?: string,
    persistActive?: boolean
  ) => {
    setPriceForCell(value, variantId, currencyCode, regionId)
    if (persistActive) {
      activeAmount = value
    }
  }

  const onDragStart = (
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => {
    selectCell(variantId, currencyCode, regionId)
    setIsDrag(true)
  }

  const onDragEnd = () => {
    setIsDrag(false)
  }

  /**
   * ==================== EFFECTS ====================
   */

  useEffect(() => {
    resetSelection()

    const nextState: Record<string, number | undefined> = {}
    props.product.variants!.forEach((variant) => {
      props.currencies.forEach((c) => {
        const currencyMetadata = CURRENCY_MAP[c.toUpperCase()]

        const ma = getCurrencyPricesOnly(variant.prices!).find(
          (p) => p.currency_code === c
        )

        if (ma) {
          nextState[getKey(variant.id, c)] =
            ma.amount / Math.pow(10, currencyMetadata.decimal_digits)
        }
      })

      props.regions.forEach((r) => {
        const ma = getRegionPricesOnly(variant.prices!).find(
          (p) => p.region_id === r
        )

        if (ma) {
          const currencyMetadata = CURRENCY_MAP[ma.currency_code.toUpperCase()]
          nextState[getKey(variant.id, undefined, r)] =
            ma.amount / Math.pow(10, currencyMetadata.decimal_digits)
        }
      })
    })

    setEditedPrices(nextState)
  }, [props.currencies, props.regions, props.product.variants])

  useEffect(() => {
    const down = () => {
      document.body.style.userSelect = "none"
      resetSelection()
    }

    const up = () => {
      document.body.style.userSelect = "auto"
      setIsDrag(false)
    }

    /**
     * Delete selected prices
     */
    const onKeyDown = (e: KeyboardEvent) => {
      // if backspace is pressed but we aren't focused on any input
      if (e.key === "Backspace" && document.activeElement === document.body) {
        const next = { ...editedPrices }
        Object.keys(selectedCells).forEach((k) => {
          const [v, c] = k.split("-")
          next[getKey(v, c)] = undefined
        })
        setEditedPrices(next)
        // resetSelection()
      }

      /**
       * Undo last selection change (or delete) on CMD/CTR + Z
       */
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 90) {
        e.preventDefault()
        if (Object.keys(selectedCells).length) {
          e.stopPropagation()
          setEditedPrices(prevPriceState || {})
          resetSelection()
        }
      }

      // if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
      //   navigator.clipboard.writeText(JSON.stringify(editedPrices))
      // }
    }

    document.addEventListener("mousedown", down)
    document.addEventListener("mouseup", up)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("mousedown", down)
      document.removeEventListener("mouseup", up)
      document.addEventListener("keydown", onKeyDown)
    }
  }, [Object.keys(selectedCells).length])

  useEffect(() => {
    // when drag is released, notify parent container that prices have changed
    if (!isDrag) {
      props.onPriceUpdate(editedPrices)
    }
  }, [isDrag, editedPrices])

  return (
    <div className="h-full overflow-x-auto">
      <table
        onMouseMove={
          /** prevent highlighting **/
          (e) => e.preventDefault()
        }
        style={{ fontSize: 13, borderCollapse: "collapse" }}
        className="w-full table-auto"
      >
        <thead>
          <tr
            style={{ height: 42 }}
            className="tw-text-medusa-text-subtle h-2 text-left font-normal"
          >
            <th className="h-2 min-w-[180px] border pl-4 font-medium text-gray-400">
              Product
            </th>
            <th className="min-w-[180px] border pl-4 font-medium text-gray-400">
              SKU
            </th>
            {props.currencies.map((c) => {
              const currency = storeCurrencies?.find((sc) => sc.code === c)
              return (
                <th
                  key={c}
                  className="min-w-[220px] border px-4 font-medium text-gray-400"
                >
                  <div className="flex items-center justify-between">
                    <span>Price {c.toUpperCase()}</span>
                    {currency?.includes_tax && (
                      <Tooltip content="Tax inclusive pricing" side="bottom">
                        <IconBuildingTax strokeWidth={1.3} size={20} />
                      </Tooltip>
                    )}
                  </div>
                </th>
              )
            })}
            {props.regions.map((r) => {
              const region = storeRegions?.find((sr) => sr.id === r)
              if (!region) {
                return null
              }
              return (
                <th
                  key={r}
                  className="min-w-[220px] border px-4 font-medium text-gray-400"
                >
                  <div className="flex items-center justify-between">
                    <span>Price {region?.name}</span>
                    {region.includes_tax && (
                      <Tooltip content="Tax inclusive pricing" side="bottom">
                        <IconBuildingTax strokeWidth={1.3} size={20} />
                      </Tooltip>
                    )}
                  </div>
                </th>
              )
            })}
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
            {props.regions.map((r) => (
              <td className="border pr-4 text-right" key={r}>
                -
              </td>
            ))}
          </tr>

          {props.product.variants!.map((variant, index) => {
            return (
              <tr
                key={variant.id}
                onMouseEnter={(e) => onMouseRowEnter(e, variant.id)}
                style={{ lineHeight: 3 }}
              >
                <td className="border pl-10 text-gray-400">{variant.title}</td>
                <td className="border pl-4 text-gray-400 ">{variant.sku}</td>

                {props.currencies.map((c) => {
                  return (
                    <CurrencyCell
                      key={variant.id + c}
                      currencyCode={c}
                      variant={variant}
                      isSelected={selectedCells[getKey(variant.id, c)]}
                      editedAmount={editedPrices[getKey(variant.id, c)]}
                      onInputChange={onInputChange}
                      onMouseCellClick={onMouseCellClick}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      isAnchor={anchorIndex === index}
                      isRangeStart={
                        activeCurrencyOrRegion === c && startIndex === index
                      }
                      isRangeEnd={
                        activeCurrencyOrRegion === c && index === endIndex
                      }
                      isInRange={
                        activeCurrencyOrRegion === c &&
                        index >= startIndex &&
                        index <= endIndex
                      }
                    />
                  )
                })}

                {props.regions.map((r) => (
                  <CurrencyCell
                    key={variant.id + r}
                    region={r!}
                    variant={variant}
                    isSelected={selectedCells[getKey(variant.id, undefined, r)]}
                    editedAmount={
                      editedPrices[getKey(variant.id, undefined, r)]
                    }
                    onInputChange={onInputChange}
                    onMouseCellClick={onMouseCellClick}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isAnchor={anchorIndex === index}
                    isRangeStart={
                      activeCurrencyOrRegion === r && startIndex === index
                    }
                    isRangeEnd={
                      activeCurrencyOrRegion === r && index === endIndex
                    }
                    isInRange={
                      activeCurrencyOrRegion === r &&
                      index >= startIndex &&
                      index <= endIndex
                    }
                  />
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default EditPricesTable

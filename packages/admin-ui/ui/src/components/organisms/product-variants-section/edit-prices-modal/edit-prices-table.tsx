import React, { useEffect, useState } from "react"
import { useAdminRegions } from "medusa-react"
import { Product } from "@medusajs/client-types"

import {
  getCellYMidpoint,
  getCurrencyPricesOnly,
  getRegionPricesOnly,
} from "./utils"
import CurrencyCell from "./currency-cell"
import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"

type EditPricesTableProps = {
  product: Product
  currencies: string[]
  regions: string[]
}

enum MoveDirection {
  Up = "UP",
  Down = "DOWN",
}

enum AnchorPosition {
  Above = "ABOVE",
  Below = "BELOW",
}

let anchor: number | null = null
let lastVisited: number | null = null

/**
 * During drag move keep info which column is active one
 */
let activeCurrencyOrRegion = undefined
let lastVisitedVariant = undefined

let activeAmount: undefined | number = undefined

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
  const { regions: storeRegions } = useAdminRegions()

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
    region?: string
  ) => {
    if ((currencyCode || region) !== activeCurrencyOrRegion) {
      return
    }

    const key = getKey(variantId, currencyCode, region)
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
    if (typeof amount === "undefined") {
      delete next[getKey(variantId, currencyCode, region)]
    } else {
      next[getKey(variantId, currencyCode, region)] = amount
    }
    setEditedPrices(next)
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
      selectCell(variantId, activeCurrencyOrRegion)
      setPriceForCell(activeAmount, variantId, activeCurrencyOrRegion)
    }

    if (
      anchor === currentY || // We returned to the anchor cell
      (anchorPosition === AnchorPosition.Above && move === MoveDirection.Up) ||
      (anchorPosition === AnchorPosition.Below && move === MoveDirection.Down)
    ) {
      deselectCell(lastVisitedVariant, activeCurrencyOrRegion)
      setPriceForCell(undefined, lastVisitedVariant, activeCurrencyOrRegion)
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
    anchor = getCellYMidpoint(event)
    lastVisited = anchor
    lastVisitedVariant = variantId

    activeCurrencyOrRegion = currencyCode || regionId
    activeAmount = Number(event.target.value?.replace(",", ""))
    selectCell(variantId, currencyCode, regionId)
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
  }, [props.currencies, props.product.variants])

  useEffect(() => {
    const down = () => {
      document.body.style.userSelect = "none"
      setSelectedCells({})
    }
    const up = () => {
      document.body.style.userSelect = "auto"
      setIsDrag(false)
    }

    document.addEventListener("mousedown", down)
    document.addEventListener("mouseup", up)

    return () => {
      document.removeEventListener("mousedown", down)
      document.removeEventListener("mouseup", up)
    }
  }, [])

  return (
    <div className="h-full overflow-x-auto">
      <table
        onMouseMove={
          /** prevent highlighting **/
          (e) => e.preventDefault()
        }
        style={{ fontSize: 13 }}
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
            {props.currencies.map((c) => (
              <th
                key={c}
                className="min-w-[220px] border pl-4 font-medium text-gray-400"
              >
                Price {c.toUpperCase()}
              </th>
            ))}
            {props.regions.map((r) => (
              <th
                key={r}
                className="min-w-[220px] border pl-4 font-medium text-gray-400"
              >
                Price {storeRegions?.find((sr) => sr.id === r)?.name}
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
            {props.regions.map((r) => (
              <td className="border pr-4 text-right" key={r}>
                -
              </td>
            ))}
          </tr>

          {props.product.variants!.map((variant) => {
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
                      isSelected={
                        isDrag && selectedCells[getKey(variant.id, c)]
                      }
                      editedAmount={editedPrices[getKey(variant.id, c)]}
                      onInputChange={onInputChange}
                      onMouseCellClick={onMouseCellClick}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      isDragging={isDrag}
                    />
                  )
                })}

                {props.regions.map((r) => (
                  <CurrencyCell
                    key={variant.id + r}
                    region={r!}
                    variant={variant}
                    isSelected={
                      isDrag && selectedCells[getKey(variant.id, undefined, r)]
                    }
                    editedAmount={
                      editedPrices[getKey(variant.id, undefined, r)]
                    }
                    onInputChange={onInputChange}
                    onMouseCellClick={onMouseCellClick}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    isDragging={isDrag}
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

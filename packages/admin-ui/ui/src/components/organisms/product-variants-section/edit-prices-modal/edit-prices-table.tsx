import React, { useEffect, useState } from "react"
import { useAdminRegions } from "medusa-react"
import { Product } from "@medusajs/client-types"

import { getCurrencyPricesOnly, getRegionPricesOnly } from "./utils"
import CurrencyCell from "./currency-cell"

type EditPricesTableProps = {
  product: Product
  currencies: string[]
  regions: string[]
}

enum MoveDirection {
  Up = 1,
  Down,
  Left,
  Right,
}

enum AnchorPosition {
  Above = 1,
  Below,
}

let anchor: { x: number; y: number } | null = null
let lastVisited: { x: number; y: number } | null = null

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

  const onMouseCellEnter = (
    event: React.MouseEvent,
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => {
    if (!isDrag || !lastVisited || !anchor) {
      return
    }

    if (variantId === lastVisitedVariant) {
      // just side move
      return
    }

    // console.log(event.target.getBoundingClientRect())

    lastVisitedVariant = variantId

    const currentY = event.target.getBoundingClientRect().bottom

    const move =
      currentY > lastVisited.y ? MoveDirection.Down : MoveDirection.Up

    const anchorPosition =
      currentY > anchor.y ? AnchorPosition.Above : AnchorPosition.Below

    if (
      (anchorPosition === AnchorPosition.Above &&
        move === MoveDirection.Down) ||
      (anchorPosition === AnchorPosition.Below && move === MoveDirection.Up)
    ) {
      selectCell(variantId, activeCurrencyOrRegion)
      setPriceForCell(activeAmount, variantId, activeCurrencyOrRegion)
    }

    lastVisited = {
      x: event.pageX,
      y: event.target.getBoundingClientRect().bottom,
    }
  }

  const onMouseCellLeave = (event: React.MouseEvent, variantId: string) => {
    if (!isDrag || !lastVisited || !anchor) {
      return
    }

    const currentY = event.target.getBoundingClientRect().bottom

    const move =
      currentY > lastVisited.y ? MoveDirection.Down : MoveDirection.Up

    const anchorPosition =
      currentY > anchor.y ? AnchorPosition.Above : AnchorPosition.Below

    if (
      (anchorPosition === AnchorPosition.Above && move === MoveDirection.Up) ||
      (anchorPosition === AnchorPosition.Below && move === MoveDirection.Down)
    ) {
      deselectCell(variantId, activeCurrencyOrRegion)
      setPriceForCell(undefined, variantId, activeCurrencyOrRegion)
    }
  }

  const onMouseCellClick = (
    event: React.MouseEvent,
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => {
    selectCell(variantId, currencyCode, regionId)
    activeAmount = Number(event.target.value?.replace(",", ""))

    activeCurrencyOrRegion = currencyCode || regionId
    anchor = { x: event.pageX, y: event.target.getBoundingClientRect().bottom }
    lastVisited = anchor
  }

  const onInputChange = (
    value: number | undefined,
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => {
    setPriceForCell(value, variantId, currencyCode, regionId)
  }

  const onDragStart = () => {
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
        nextState[getKey(variant.id, c)] = getCurrencyPricesOnly(
          variant.prices!
        ).find((p) => p.currency_code === c)?.amount
      })

      props.regions.forEach((r) => {
        nextState[getKey(variant.id, undefined, r)] = getRegionPricesOnly(
          variant.prices!
        ).find((p) => p.region_id === r)?.amount
      })
    })
    setEditedPrices(nextState)
  }, [props.currencies, props.product.variants])

  useEffect(() => {
    const down = () => {
      setSelectedCells({})
    }
    const up = () => setIsDrag(false)

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
              <tr key={variant.id} style={{ lineHeight: 3 }}>
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
                      onMouseCellEnter={onMouseCellEnter}
                      onMouseCellLeave={onMouseCellLeave}
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
                    isSelected={selectedCells[getKey(variant.id, undefined, r)]}
                    editedAmount={
                      editedPrices[getKey(variant.id, undefined, r)]
                    }
                    onInputChange={onInputChange}
                    onMouseCellClick={onMouseCellClick}
                    onMouseCellEnter={onMouseCellEnter}
                    onMouseCellLeave={onMouseCellLeave}
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

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useAdminRegions, useAdminStore } from "medusa-react"
import { Product } from "@medusajs/client-types"

import { getCurrencyPricesOnly, getRegionPricesOnly } from "./utils"
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

/**
 * Variant cell that is origin of the current drag move.
 */
let anchorVariant: string | undefined

/**
 * During drag move keep info which column is active one.
 */
let activeCurrencyOrRegion: string | undefined = undefined

/**
 * Pointer for displaying highlight rectangle range.
 */
let startIndex: number | undefined
let endIndex: number | undefined
let anchorIndex: number | undefined

/**
 * Temp. variable for persisting previous "editedPrices" state before editing,
 * so we can undo changes.
 */
let prevPriceState: Record<string, number> | undefined = undefined

/**
 * Ordered list of variant id that are currently rendered.
 */
let variantIds: string[] = []

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

  const initialPricesSet = useRef(false)

  const [isDragFill, setIsDragFill] = useState(false)
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

    anchorVariant = undefined
    activeCurrencyOrRegion = undefined

    // warning state updates in event handlers will be batched together so if there is another
    // `setSelectedCells` (or `resetSelection`) call in the same event handler, only last state will apply
    setSelectedCells({})
  }

  /**
   * ==================== HANDLERS ====================
   */

  const onMouseRowEnter = (variantId: string) => {
    if (!(isDragFill || isDrag) || !anchorVariant) {
      return
    }

    const currentIndex = variantIds.findIndex((v) => v === variantId)

    if (currentIndex > anchorIndex) {
      startIndex = anchorIndex
      endIndex = currentIndex
    } else {
      startIndex = currentIndex
      endIndex = anchorIndex
    }

    const selectedVariants = variantIds.slice(startIndex, endIndex + 1)

    const keys = selectedVariants.map((vId) =>
      getKey(vId, activeCurrencyOrRegion)
    )

    const nextSelection = { ...selectedCells }
    const nextPrices = { ...editedPrices }

    Object.keys(nextSelection).forEach((k) => {
      // deselect case
      if (k.split("-")[1] === activeCurrencyOrRegion && !keys.includes(k)) {
        delete nextSelection[k] // remove selection
        nextPrices[k] = prevPriceState[k] // ...and reset price of that cell to the previous state
      }
    })

    // select cells in range and set price
    keys.forEach((k) => {
      nextSelection[k] = true

      if (isDragFill) {
        nextPrices[k] =
          editedPrices[getKey(anchorVariant, activeCurrencyOrRegion)]
      }
    })

    setSelectedCells(nextSelection)
    if (isDragFill) {
      setEditedPrices(nextPrices)
    }
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
    anchorVariant = variantId
    anchorIndex = variantIds.findIndex((v) => v === anchorVariant)

    activeCurrencyOrRegion = currencyCode || regionId
    setSelectedCells({ [getKey(variantId, currencyCode || regionId)]: true })
    setIsDrag(true)

    startIndex = props.product.variants!.findIndex((v) => v.id === variantId)
    endIndex = startIndex
    anchorIndex = startIndex
  }

  const onInputChange = (
    value: number | undefined,
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => {
    setPriceForCell(value, variantId, currencyCode, regionId)
  }

  const onDragFillStart = (
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => {
    selectCell(variantId, currencyCode, regionId)
    setIsDragFill(true)
  }

  /**
   * ==================== EFFECTS ====================
   */

  useEffect(() => {
    resetSelection()

    /**
     * Called initially to populate `editedPrices` but called on column toggle as well
     */

    if (!props.currencies || !props.regions || !props.product.variants) {
      return
    }

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

    variantIds = props.product.variants!.map((v) => v.id)

    initialPricesSet.current = true

    setEditedPrices((s) => ({ ...nextState, ...s })) // called on column toggle -> don't override previous edits
  }, [props.currencies, props.regions, props.product.variants])

  useEffect(() => {
    const down = () => {
      document.body.style.userSelect = "none"
      resetSelection()
    }

    const up = () => {
      document.body.style.userSelect = "auto"
      setIsDragFill(false)
      setIsDrag(false)
    }

    /**
     * Delete selected prices
     */
    const onKeyDown = (e: KeyboardEvent) => {
      // if backspace is pressed but we aren't focused on any input
      if (e.key === "Backspace" && document.activeElement.tagName !== "INPUT") {
        const next = { ...editedPrices }
        Object.keys(selectedCells).forEach((k) => {
          const [v, c] = k.split("-")
          next[getKey(v, c)] = undefined
        })
        setEditedPrices(next)
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
    }

    document.addEventListener("mousedown", down)
    document.addEventListener("mouseup", up)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("mousedown", down)
      document.removeEventListener("mouseup", up)
      document.addEventListener("keydown", onKeyDown)
    }
  }, [selectedCells])

  useEffect(() => {
    // when drag is released, notify parent container that prices have changed
    if (!isDragFill) {
      props.onPriceUpdate(editedPrices)
    }
  }, [isDragFill, editedPrices])

  const productTitle = useMemo(() => {
    let max = 0

    props.product.variants!.forEach(
      (v) => (max = Math.max(max, v.title.length + (v.sku ? v.sku.length : 0)))
    )

    return props.product.title.length > max
      ? props.product.title.substring(0, max) + "..."
      : props.product.title
  }, [props.product])

  if (!initialPricesSet.current) {
    /**
     * Don't render the table until initial prices are populated in the state.
     * This prevents cells from populating `editedPrices` with `undefined` values
     * when `onInputChange` is called in an effect on mount.
     */
    return
  }

  return (
    <div className="h-full overflow-x-auto">
      <table
        onMouseMove={
          /** prevent default browser highlighting while dragging **/
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
            <th className="h-2 border pl-4 font-medium text-gray-400">
              Product
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
                  className="min-w-[220px] max-w-[220px]  border px-4 font-medium text-gray-400"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex overflow-hidden">
                      <span title={region?.name} className="truncate pr-1">
                        Price {region?.name}
                      </span>
                      ({region?.currency_code.toUpperCase()})
                    </span>
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
          <tr style={{ lineHeight: 3, background: "#f9fafb" }}>
            <td className="border pl-4 pr-4">
              <div className="text-black-800 flex items-center gap-2 overflow-hidden">
                {props.product.thumbnail && (
                  <img
                    src={props.product.thumbnail}
                    alt="Thumbnail"
                    className="h-[22px] w-[16px] rounded"
                  />
                )}
                <span title={props.product.title} className="truncate">
                  {productTitle}
                </span>
              </div>
            </td>
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
                onMouseEnter={() => onMouseRowEnter(variant.id)}
                style={{ lineHeight: 3 }}
              >
                <td className="whitespace-nowrap border pl-10 pr-4 text-gray-600">
                  {variant.title} {variant.sku && `∙ ${variant.sku}`}
                </td>

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
                      onDragFillStart={onDragFillStart}
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
                    onDragFillStart={onDragFillStart}
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

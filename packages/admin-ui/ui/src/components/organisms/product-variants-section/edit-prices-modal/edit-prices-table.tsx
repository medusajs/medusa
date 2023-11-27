import { Product } from "@medusajs/client-types"
import { useAdminRegions, useAdminStore } from "medusa-react"
import React, { useEffect, useMemo, useRef, useState } from "react"

import useNotification from "../../../../hooks/use-notification"
import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"
import Tooltip from "../../../atoms/tooltip"
import IconBuildingTax from "../../../fundamentals/icons/building-tax-icon"
import CurrencyCell from "./currency-cell"
import {
  getCurrencyPricesOnly,
  getRegionPricesOnly,
  isText,
  mod,
} from "./utils"

enum ArrowMove {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

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
 * Currency or region column that is origin of the drag move.
 */
let anchorCurrencyOrRegion: string | undefined

/**
 * Pointer for displaying highlight rectangle range.
 */
let startIndex: number | undefined
let endIndex: number | undefined
let anchorIndex: number | undefined

let startIndexCol: number | undefined
let endIndexCol: number | undefined
let anchorIndexCol: number | undefined

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

  const notification = useNotification()

  const initialPricesSet = useRef(false)

  const columns = [...props.currencies, ...props.regions]

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
    if ((currencyCode || region) !== anchorCurrencyOrRegion) {
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

    anchorIndexCol = undefined
    startIndexCol = undefined
    endIndexCol = undefined

    anchorVariant = undefined
    anchorCurrencyOrRegion = undefined

    // warning state updates in event handlers will be batched together so if there is another
    // `setSelectedCells` (or `resetSelection`) call in the same event handler, only last state will apply
    setSelectedCells({})
  }

  const moveAnchor = (
    direction: ArrowMove,
    isShift: boolean,
    isCmd: boolean
  ) => {
    if (!anchorIndex) {
      setSelectedCells({ [getKey(variantIds[0], columns[0])]: true })
    }

    if (direction === ArrowMove.DOWN) {
      if (!isShift) {
        let ind = variantIds.findIndex((v) => v === anchorVariant)
        ind = mod(ind + 1, variantIds.length)
        const nextVariant = variantIds[ind]

        anchorVariant = nextVariant
        anchorIndex = ind
        startIndex = ind
        endIndex = ind

        startIndexCol = anchorIndexCol
        endIndexCol = anchorIndexCol

        setSelectedCells({
          [getKey(nextVariant, anchorCurrencyOrRegion)]: true,
        })
      } else {
        if (isCmd) {
          startIndex = anchorIndex
          endIndex = variantIds.length - 1
        } else {
          if (anchorIndex === startIndex) {
            endIndex = Math.min(endIndex + 1, variantIds.length - 1)
          } else {
            startIndex = Math.min(startIndex + 1, variantIds.length - 1)
          }
        }

        onSelectionRangeChange()
      }
    }

    if (direction === ArrowMove.UP) {
      if (!isShift) {
        let ind = variantIds.findIndex((v) => v === anchorVariant)
        ind = mod(ind - 1, variantIds.length)
        const nextVariant = variantIds[ind]
        anchorVariant = nextVariant

        anchorIndex = ind
        startIndex = ind
        endIndex = ind

        startIndexCol = anchorIndexCol
        endIndexCol = anchorIndexCol

        setSelectedCells({
          [getKey(nextVariant, anchorCurrencyOrRegion)]: true,
        })
      } else {
        if (isCmd) {
          endIndex = anchorIndex
          startIndex = 0
        } else {
          if (anchorIndex === startIndex) {
            if (startIndex === endIndex) {
              startIndex = Math.max(startIndex - 1, 0)
            } else {
              endIndex = Math.max(endIndex - 1, 0)
            }
          } else {
            startIndex = Math.max(startIndex - 1, 0)
          }
        }

        onSelectionRangeChange()
      }
    }

    if (direction === ArrowMove.LEFT) {
      if (!isShift) {
        let ind = columns.findIndex((v) => v === anchorCurrencyOrRegion)
        ind = mod(ind - 1, columns.length)
        const nextCol = columns[ind]

        anchorCurrencyOrRegion = nextCol

        anchorIndexCol = ind
        startIndexCol = ind
        endIndexCol = ind

        startIndex = anchorIndex
        endIndex = anchorIndex

        setSelectedCells({
          [getKey(anchorVariant, nextCol)]: true,
        })
      } else {
        if (isCmd) {
          endIndexCol = anchorIndexCol
          startIndexCol = 0
        } else {
          if (anchorIndexCol === startIndexCol) {
            if (startIndexCol === endIndexCol) {
              startIndexCol = Math.max(startIndexCol - 1, 0)
            } else {
              endIndexCol = Math.max(endIndexCol - 1, 0)
            }
          } else {
            startIndexCol = Math.max(startIndexCol - 1, 0)
          }
        }

        onSelectionRangeChange()
      }
    }

    if (direction === ArrowMove.RIGHT) {
      if (!isShift) {
        let ind = columns.findIndex((v) => v === anchorCurrencyOrRegion)
        ind = mod(ind + 1, columns.length)
        const nextCol = columns[ind]

        anchorCurrencyOrRegion = nextCol

        anchorIndexCol = ind
        startIndexCol = ind
        endIndexCol = ind

        startIndex = anchorIndex
        endIndex = anchorIndex

        setSelectedCells({
          [getKey(anchorVariant, nextCol)]: true,
        })
      } else {
        if (isCmd) {
          startIndexCol = anchorIndexCol
          endIndexCol = columns.length - 1
        } else {
          if (anchorIndexCol === startIndexCol) {
            endIndexCol = Math.min(endIndexCol + 1, columns.length - 1)
          } else {
            startIndexCol = Math.min(startIndexCol + 1, columns.length - 1)
          }
        }
        onSelectionRangeChange()
      }
    }
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

    onSelectionRangeChange()
  }

  const onColumnOver = (currencyOrRegion: string) => {
    if (!(isDragFill || isDrag)) {
      return
    }

    const currentIndexCol = columns.findIndex((v) => v === currencyOrRegion)

    if (currentIndexCol > anchorIndexCol) {
      endIndexCol = currentIndexCol
      startIndexCol = anchorIndexCol
    } else {
      startIndexCol = currentIndexCol
      endIndexCol = anchorIndexCol
    }

    onSelectionRangeChange()
  }

  const onSelectionRangeChange = () => {
    const selectedColumns = columns.slice(startIndexCol, endIndexCol + 1)
    const selectedVariants = variantIds.slice(startIndex, endIndex + 1)

    const keys = []

    selectedVariants.forEach((vId) =>
      selectedColumns.forEach((c) => {
        keys.push(getKey(vId, c))
      })
    )

    const nextSelection = { ...selectedCells }
    const nextPrices = { ...editedPrices }

    Object.keys(nextSelection).forEach((k) => {
      // deselect case
      if (!keys.includes(k)) {
        delete nextSelection[k] // remove selection
        nextPrices[k] = prevPriceState[k] // ...and reset price of that cell to the previous state
      }
    })

    // select cells in range and set price
    keys.forEach((k) => {
      nextSelection[k] = true

      if (isDragFill) {
        nextPrices[k] =
          editedPrices[getKey(anchorVariant, anchorCurrencyOrRegion)]
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
    startIndex = anchorIndex
    endIndex = startIndex

    anchorCurrencyOrRegion = currencyCode || regionId
    anchorIndexCol = columns.findIndex((v) => v === anchorCurrencyOrRegion)
    startIndexCol = anchorIndexCol
    endIndexCol = anchorIndexCol

    setSelectedCells({ [getKey(variantId, currencyCode || regionId)]: true })
    setIsDrag(true)
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

      if (e.key === "Tab") {
        e.stopPropagation()
        e.preventDefault()

        if (e.shiftKey) {
          if (anchorIndexCol === 0) {
            moveAnchor(ArrowMove.UP, false)
          }
          moveAnchor(ArrowMove.LEFT, false)
        } else {
          if (anchorIndexCol === columns.length - 1) {
            moveAnchor(ArrowMove.DOWN, false)
          }
          moveAnchor(ArrowMove.RIGHT, false)
        }
      }

      if (e.keyCode === 38) {
        moveAnchor(ArrowMove.UP, e.shiftKey, e.metaKey || e.ctrlKey)
      }

      if (e.keyCode === 40) {
        moveAnchor(ArrowMove.DOWN, e.shiftKey, e.metaKey || e.ctrlKey)
      }

      if (e.keyCode === 37) {
        moveAnchor(ArrowMove.LEFT, e.shiftKey, e.metaKey || e.ctrlKey)
      }

      if (e.keyCode === 39) {
        moveAnchor(ArrowMove.RIGHT, e.shiftKey, e.metaKey || e.ctrlKey)
      }

      if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
        let ret = ""
        const variants = {}
        const columns = {}

        Object.keys(selectedCells).forEach((k) => {
          const [r, c] = k.split("-")
          variants[r] = true
          columns[c] = true
        })

        Object.keys(variants)
          .sort((v1, v2) => variantIds.indexOf(v1) - variantIds.indexOf(v2))
          .forEach((k) => {
            Object.keys(columns).forEach((c) => {
              const price = editedPrices[getKey(k, c)]

              ret += (!isNaN(price) ? price : "") + "\t"
            })

            ret = ret.slice(0, -1)
            ret += `\n`
          })

        ret = ret.slice(0, -1)

        navigator.clipboard.writeText(ret)
        notification("Success", "Copied to clipboard", "success")
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

    const onPaste = (event: ClipboardEvent) => {
      const paste = (event.clipboardData || window.clipboardData).getData(
        "text"
      )

      const rows = paste.split("\n").map((r) => r.split("\t"))

      // single cell click -> determine from the content
      if (
        typeof anchorIndex === "number" &&
        typeof anchorIndexCol === "number"
      ) {
        const _edited = { ...editedPrices }

        const isRange = startIndex !== endIndex || startIndexCol !== endIndexCol

        // if only anchor is clicked past selected, if range is selected fill and repeat until selected area is filled
        const iBoundary = !isRange ? rows.length - 1 : endIndex - startIndex

        for (let i = 0; i <= iBoundary; i++) {
          if (i >= variantIds.length) {
            break
          }

          const parts = rows[i % rows.length]

          // if only anchor is clicked past selected, if range is selected fill and repeat until selected area is filled
          const jBoundary = !isRange
            ? parts.length - 1
            : endIndexCol - startIndexCol

          for (let j = 0; j <= jBoundary; j++) {
            if (j >= columns.length) {
              break
            }

            if (isText(parts[j % parts.length])) {
              notification(
                "Error",
                "Invalid data - copied cells contain text",
                "error"
              )
              return
            }

            const amount = parseFloat(parts[j % parts.length])

            _edited[
              getKey(variantIds[startIndex + i], columns[startIndexCol + j])
            ] = !isNaN(amount) ? amount : undefined
          }
        }

        setEditedPrices(_edited)
      }
    }

    document.addEventListener("mousedown", down)
    document.addEventListener("mouseup", up)
    document.addEventListener("keydown", onKeyDown)

    document.addEventListener("paste", onPaste)

    return () => {
      document.removeEventListener("mousedown", down)
      document.removeEventListener("mouseup", up)
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("paste", onPaste)
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
    // 60px is the height of the subheader, 64px is the height of the header
    <div className="h-[calc(100%-60px-64px)] overflow-auto">
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
            className="tw-text-medusa-text-subtle h-10 text-left font-normal"
          >
            <th className="h-2 border border-t-0 pl-4 font-medium text-gray-400">
              Product
            </th>
            {props.currencies.map((c) => {
              const currency = storeCurrencies?.find((sc) => sc.code === c)
              return (
                <th
                  key={c}
                  className="min-w-[220px] border border-t-0 px-4 font-medium text-gray-400"
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
                  className="min-w-[220px] max-w-[220px]  border border-t-0 px-4 font-medium text-gray-400"
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
          <tr style={{ lineHeight: 3, background: "#f9fafb" }} className="">
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
                <td className="h-10 whitespace-nowrap border pl-10 pr-4 text-gray-600">
                  {variant.title} {variant.sku && `∙ ${variant.sku}`}
                </td>

                {props.currencies.map((c, indexCol) => {
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
                      onColumnOver={onColumnOver}
                      isAnchor={
                        anchorIndex === index && anchorIndexCol === indexCol
                      }
                      isRangeStart={startIndex === index}
                      isRangeEnd={index === endIndex}
                      isInRange={index >= startIndex && index <= endIndex}
                      isRangeStartCol={startIndexCol === indexCol}
                      isRangeEndCol={indexCol === endIndexCol}
                      isInRangeCol={
                        indexCol >= startIndexCol && indexCol <= endIndexCol
                      }
                    />
                  )
                })}

                {props.regions.map((r, indexCol) => {
                  indexCol = props.currencies.length + indexCol
                  return (
                    <CurrencyCell
                      key={variant.id + r}
                      region={r!}
                      variant={variant}
                      isSelected={
                        selectedCells[getKey(variant.id, undefined, r)]
                      }
                      editedAmount={
                        editedPrices[getKey(variant.id, undefined, r)]
                      }
                      onInputChange={onInputChange}
                      onMouseCellClick={onMouseCellClick}
                      onDragFillStart={onDragFillStart}
                      onColumnOver={onColumnOver}
                      isAnchor={
                        anchorIndex === index && anchorIndexCol === indexCol
                      }
                      isRangeStart={startIndex === index}
                      isRangeEnd={index === endIndex}
                      isInRange={index >= startIndex && index <= endIndex}
                      isRangeStartCol={startIndexCol === indexCol}
                      isRangeEndCol={indexCol === endIndexCol}
                      isInRangeCol={
                        indexCol >= startIndexCol && indexCol <= endIndexCol
                      }
                    />
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default EditPricesTable

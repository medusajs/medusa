import { LineItem, Order } from "@medusajs/medusa"
import clsx from "clsx"
import React from "react"
import {
  isLineItemCanceled,
  isLineItemReturned,
} from "../../../utils/is-line-item"
import { formatAmountWithSymbol } from "../../../utils/prices"
import CheckIcon from "../../fundamentals/icons/check-icon"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import Table from "../../molecules/table"

type toReturnType = Record<string, { quantity: number }>

type RMASelectProductTableProps = {
  order: Omit<Order, "beforeInsert">
  allItems: (Omit<LineItem, "beforeInsert"> | null)[]
  toReturn: toReturnType
  setToReturn: (items: toReturnType) => void
}

const RMASelectReturnProductTable: React.FC<RMASelectProductTableProps> = ({
  order,
  allItems,
  toReturn,
  setToReturn,
}) => {
  const handleQuantity = (change, item) => {
    if (
      (item.quantity === toReturn[item.id].quantity && change > 0) ||
      (toReturn[item.id].quantity === 1 && change < 0)
    ) {
      return
    }

    const newReturns = {
      ...toReturn,
      [item.id]: {
        ...toReturn[item.id],
        quantity: (toReturn[item.id]?.quantity || 0) + change,
      },
    }

    setToReturn(newReturns)
  }

  const handleReturnToggle = (item: Omit<LineItem, "beforeInsert">) => {
    const id = item.id

    const newReturns = { ...toReturn }

    if (id in toReturn) {
      delete newReturns[id]
    } else {
      newReturns[id] = {
        quantity: item.quantity,
      }
    }

    setToReturn(newReturns)
  }

  return (
    <Table>
      <Table.HeadRow className="text-grey-50 inter-small-semibold">
        <Table.HeadCell colSpan={2}>Product Details</Table.HeadCell>
        <Table.HeadCell className="text-right pr-8">Quantity</Table.HeadCell>
        <Table.HeadCell className="text-right">Refundable</Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
      </Table.HeadRow>
      <Table.Body>
        {allItems.map((item) => {
          // Only show items that have not been returned,
          // and aren't canceled
          if (
            !item ||
            isLineItemReturned(item) ||
            isLineItemCanceled(item, order)
          ) {
            return
          }
          const checked = item.id in toReturn
          return (
            <Table.Row
              className={clsx("border-b-grey-0 hover:bg-grey-0")}
              key={item.id}
            >
              <Table.Cell>
                <div className="items-center ml-1 h-full flex">
                  <div
                    onClick={() => handleReturnToggle(item)}
                    className={`mr-4 w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base ${
                      checked && "bg-violet-60"
                    }`}
                  >
                    <span className="self-center">
                      {checked && <CheckIcon size={16} />}
                    </span>
                  </div>

                  <input
                    className="hidden"
                    checked={checked}
                    tabIndex={-1}
                    onChange={() => handleReturnToggle(item)}
                    type="checkbox"
                  />
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="min-w-[240px] flex py-2">
                  <div className="w-[30px] h-[40px] ">
                    <img
                      className="h-full w-full object-cover rounded"
                      src={item.thumbnail}
                    />
                  </div>
                  <div className="inter-small-regular text-grey-50 flex flex-col ml-4">
                    <span>
                      <span className="text-grey-90">{item.title}</span>
                    </span>
                    <span>{item?.variant?.title || ""}</span>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="text-right w-32 pr-8">
                {item.id in toReturn ? (
                  <div className="flex w-full text-right justify-end text-grey-50 ">
                    <span
                      onClick={() => handleQuantity(-1, item)}
                      className="w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 mr-2"
                    >
                      <MinusIcon size={16} />
                    </span>
                    <span>{toReturn[item.id].quantity || ""}</span>
                    <span
                      onClick={() => handleQuantity(1, item)}
                      className={clsx(
                        "w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 ml-2"
                      )}
                    >
                      <PlusIcon size={16} />
                    </span>
                  </div>
                ) : (
                  <span className="text-grey-40">{item.quantity}</span>
                )}
              </Table.Cell>
              <Table.Cell className="text-right">
                {formatAmountWithSymbol({
                  currency: order.currency_code,
                  amount: item.refundable || 0,
                })}
              </Table.Cell>
              <Table.Cell className="text-right text-grey-40 pr-1">
                {order.currency_code.toUpperCase()}
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default RMASelectReturnProductTable

import clsx from "clsx"
import React from "react"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Button from "../../fundamentals/button"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import Table from "../../molecules/table"

type RMAReturnProductsTableProps = {
  isAdditionalItems?: boolean
  order: any
  itemsToAdd: any[]
  handleToAddQuantity: (value, index) => void
  handleRemoveItem: (index) => void
}

const extractPrice = (prices, order) => {
  let price = prices.find((ma) => ma.region_id === order.region_id)

  if (!price) {
    price = prices.find((ma) => ma.currency_code === order.currency_code)
  }

  if (price) {
    return formatAmountWithSymbol({
      currency: order.currency_code,
      amount: price.amount * (1 + order.tax_rate / 100),
    })
  }

  return 0
}

const RMAReturnProductsTable: React.FC<RMAReturnProductsTableProps> = ({
  isAdditionalItems,
  order,
  itemsToAdd,
  handleRemoveItem,
  handleToAddQuantity,
}) => {
  return (
    <Table>
      <Table.HeadRow className="text-grey-50 inter-small-semibold">
        <Table.HeadCell>Product Details</Table.HeadCell>
        <Table.HeadCell className="text-right pr-8">Quantity</Table.HeadCell>
        <Table.HeadCell className="text-right">
          {isAdditionalItems ? "Unit Price" : "Refundable"}
        </Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
      </Table.HeadRow>
      <Table.Body>
        {itemsToAdd.map((item, index) => (
          <Table.Row className={clsx("border-b-grey-0 hover:bg-grey-0")}>
            <Table.Cell>
              <div className="min-w-[240px] flex py-2">
                <div className="w-[30px] h-[40px] ">
                  <img
                    className="h-full w-full object-cover rounded"
                    src={item.product.thumbnail}
                  />
                </div>
                <div className="inter-small-regular text-grey-50 flex flex-col ml-4">
                  <span>
                    <span className="text-grey-90">{item.product.title}</span>{" "}
                  </span>
                  <span>{item.title}</span>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="text-right w-32 pr-8">
              <div className="flex w-full text-right justify-end text-grey-50 ">
                <span
                  onClick={() => handleToAddQuantity(-1, index)}
                  className="w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 mr-2"
                >
                  <MinusIcon size={16} />
                </span>
                <span>{item.quantity || ""}</span>
                <span
                  onClick={() => handleToAddQuantity(1, index)}
                  className={clsx(
                    "w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 ml-2"
                  )}
                >
                  <PlusIcon size={16} />
                </span>
              </div>
            </Table.Cell>
            <Table.Cell className="text-right">
              {extractPrice(item.prices, order)}
            </Table.Cell>
            <Table.Cell className="text-right text-grey-40 pr-1">
              {order.currency_code.toUpperCase()}
            </Table.Cell>
            <Table.Cell>
              <Button
                onClick={() => handleRemoveItem(index)}
                variant="ghost"
                size="small"
                className="w-8 h-8 text-grey-40"
              >
                <TrashIcon size={20} />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default RMAReturnProductsTable

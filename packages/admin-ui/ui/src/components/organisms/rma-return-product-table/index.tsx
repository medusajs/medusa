import clsx from "clsx"
import React from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  return (
    <Table>
      <Table.HeadRow className="text-grey-50 inter-small-semibold">
        <Table.HeadCell>
          {t("rma-return-product-table-product-details", "Product Details")}
        </Table.HeadCell>
        <Table.HeadCell className="pr-8 text-right">
          {t("rma-return-product-table-quantity", "Quantity")}
        </Table.HeadCell>
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
              <div className="flex min-w-[240px] py-2">
                <div className="h-[40px] w-[30px] ">
                  <img
                    className="h-full w-full rounded object-cover"
                    src={item.product.thumbnail}
                  />
                </div>
                <div className="inter-small-regular text-grey-50 ml-4 flex flex-col">
                  <span>
                    <span className="text-grey-90">{item.product.title}</span>{" "}
                  </span>
                  <span>{item.title}</span>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="w-32 pr-8 text-right">
              <div className="text-grey-50 flex w-full justify-end text-right ">
                <span
                  onClick={() => handleToAddQuantity(-1, index)}
                  className="hover:bg-grey-20 mr-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded"
                >
                  <MinusIcon size={16} />
                </span>
                <span>{item.quantity || ""}</span>
                <span
                  onClick={() => handleToAddQuantity(1, index)}
                  className={clsx(
                    "hover:bg-grey-20 ml-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded"
                  )}
                >
                  <PlusIcon size={16} />
                </span>
              </div>
            </Table.Cell>
            <Table.Cell className="text-right">
              {extractPrice(item.prices, order)}
            </Table.Cell>
            <Table.Cell className="text-grey-40 pr-1 text-right">
              {order.currency_code.toUpperCase()}
            </Table.Cell>
            <Table.Cell>
              <Button
                onClick={() => handleRemoveItem(index)}
                variant="ghost"
                size="small"
                className="text-grey-40 h-8 w-8"
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

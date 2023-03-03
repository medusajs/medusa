import { LineItem } from "@medusajs/medusa"
import clsx from "clsx"
import React from "react"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import Table from "../../../../components/molecules/table"

const getFulfillableQuantity = (item: LineItem): number => {
  return item.quantity - item.fulfilled_quantity - item.returned_quantity
}

const CreateFulfillmentItemsTable = ({
  items,
  toFulfill,
  setToFulfill,
  quantities,
  setQuantities,
}) => {
  const handleQuantity = (upOrDown, item) => {
    const current = quantities[item.id]

    let newQuantities = { ...quantities }

    if (upOrDown === -1) {
      newQuantities = {
        ...newQuantities,
        [item.id]: current - 1,
      }
    } else {
      newQuantities = {
        ...newQuantities,
        [item.id]: current + 1,
      }
    }

    setQuantities(newQuantities)
  }

  const handleFulfillmentItemToggle = (item) => {
    const id = item.id
    const idxOfToggled = toFulfill.indexOf(id)

    // if already in fulfillment items, you unchecked the item
    // so we remove the item
    if (idxOfToggled !== -1) {
      const newFulfills = [...toFulfill]
      newFulfills.splice(idxOfToggled, 1)
      setToFulfill(newFulfills)
    } else {
      const newFulfills = [...toFulfill, id]
      setToFulfill(newFulfills)

      const newQuantities = {
        ...quantities,
        [item.id]: getFulfillableQuantity(item),
      }

      setQuantities(newQuantities)
    }
  }

  return (
    <Table>
      <Table.HeadRow className="text-grey-50 inter-small-semibold border-t border-t-grey-20">
        <Table.HeadCell>Details</Table.HeadCell>
        <Table.HeadCell />
        <Table.HeadCell className="text-right pr-8">Quantity</Table.HeadCell>
      </Table.HeadRow>
      <Table.Body>
        {items
          ?.filter((i) => getFulfillableQuantity(i) > 0)
          .map((item) => {
            const checked = toFulfill.includes(item.id)
            return (
              <>
                <Table.Row className={"border-b-grey-0 hover:bg-grey-0"}>
                  <Table.Cell className="w-[50px]">
                    <div className="items-center ml-1 h-full flex">
                      <div
                        onClick={() => handleFulfillmentItemToggle(item)}
                        className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base ${
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
                        onChange={() => handleFulfillmentItemToggle(item)}
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
                    {toFulfill.includes(item.id) ? (
                      <div className="flex w-full text-right justify-end text-grey-50 ">
                        <span
                          onClick={() => handleQuantity(-1, item)}
                          className={clsx(
                            "w-5 h-5 flex text-grey-50 items-center justify-center rounded cursor-pointer hover:bg-grey-20 mr-2",
                            {
                              ["pointer-events-none text-grey-30"]:
                                quantities[item.id] === 1,
                            }
                          )}
                        >
                          <MinusIcon size={16} />
                        </span>
                        <span>{quantities[item.id] || ""}</span>
                        <span
                          onClick={() => handleQuantity(1, item)}
                          className={clsx(
                            "w-5 h-5 flex text-grey-50 items-center justify-center rounded cursor-pointer hover:bg-grey-20 ml-2",
                            {
                              ["pointer-events-none text-grey-30"]:
                                item.quantity - item.fulfilled_quantity ===
                                quantities[item.id],
                            }
                          )}
                        >
                          <PlusIcon size={16} />
                        </span>
                      </div>
                    ) : (
                      <span className="text-grey-40">
                        {getFulfillableQuantity(item)}
                      </span>
                    )}
                  </Table.Cell>
                </Table.Row>
              </>
            )
          })}
      </Table.Body>
    </Table>
  )
}

export default CreateFulfillmentItemsTable

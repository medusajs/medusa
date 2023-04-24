import { FC, useCallback, useEffect, useState } from "react"
import { Product } from "@medusajs/medusa"
import Table from "../../../../../../../../../../components/molecules/table"
import Button from "../../../../../../../../../../components/fundamentals/button"
import TrashIcon from "../../../../../../../../../../components/fundamentals/icons/trash-icon"
import {
  SortableTable,
  SortableTableRow,
} from "../../../../../../../../../../components/templates/sortable-table"
import { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

export interface ProductListSortableTableProps {
  name: string
  products: Product[]
  onChange?: (products: Product[]) => void
  className?: string
}

export const ProductListSortableTable: FC<ProductListSortableTableProps> = ({
  products,
  onChange,
}) => {
  const [items, setItems] = useState<Product[]>(products)

  const handleChange = (updated: Product[]) => {
    if (onChange) onChange(updated)
  }

  useEffect(() => {
    setItems(products)
  }, [products])

  const removeItem = useCallback(
    (index) => {
      const updated = [...items]
      updated.splice(index, 1)
      setItems(updated)
      handleChange(updated)
    },
    [items]
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over?.id) return
    if (active.id === over.id) return

    const oldIndex = items.findIndex((f) => f.id === active.id)
    const newIndex = items.findIndex((f) => f.id === over?.id)
    const sortedItems = arrayMove(items, oldIndex, newIndex)

    setItems(sortedItems)
    handleChange(sortedItems)
  }

  if (!items.length) return null

  return (
    <SortableTable items={items} onDragEnd={handleDragEnd}>
      <Table.Body>
        {items.map((item, index) => (
          <SortableTableRow as={Table.Row} key={item.id} id={item.id}>
            <Table.Cell className="w-[0%] pr-base">
              <div className="h-[40px] w-[30px] bg-grey-5 rounded-soft overflow-hidden my-xsmall">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail}
                    alt="Thumbnail"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </Table.Cell>

            <Table.Cell className="w-[20%]">
              <div className="p-xsmall">{item.title}</div>
            </Table.Cell>

            <Table.Cell className="align-middle text-right">
              <div className="p-xsmall">
                <Button
                  variant="ghost"
                  size="small"
                  className="inline-block p-1 text-grey-40 cursor-pointer"
                >
                  <TrashIcon size={20} onClick={() => removeItem(index)} />
                </Button>
              </div>
            </Table.Cell>
          </SortableTableRow>
        ))}
      </Table.Body>
    </SortableTable>
  )
}

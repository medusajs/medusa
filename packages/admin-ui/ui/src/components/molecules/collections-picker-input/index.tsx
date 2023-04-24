import { FC, PropsWithChildren, useCallback, useState } from "react"
import { DragOverEvent, pointerWithin } from "@dnd-kit/core"
import { rectSortingStrategy } from "@dnd-kit/sortable"
import { ProductCollection } from "@medusajs/medusa"
import { useFieldArray, useFormContext } from "react-hook-form"
import difference from "lodash/difference"
import clsx from "clsx"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "../../templates/sortable"
import GripIcon from "../../fundamentals/icons/grip-icon"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import { AddCollectionsModal } from "../../templates/add-collections-modal"
import CrossIcon from "../../fundamentals/icons/cross-icon"

export interface CollectionsPickerInputProps {
  name: string
  collections: ProductCollection[]
}

export interface CollectionItemProps {
  item: ProductCollection
  className?: string
  onClick?: () => void
}

const CollectionItem: FC<PropsWithChildren<CollectionItemProps>> = ({
  item,
  children,
  className,
  ...props
}) => (
  <div
    className={clsx(
      "w-full h-full btn btn-medium btn-secondary px-2 gap-1 leading-small !text-grey-90",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-1">
      {children}
      {item.title}
    </div>
    <div className="flex-1" />
    <div>
      <CrossIcon className="w-4 h-4 text-grey-40" />
    </div>
  </div>
)

export const CollectionsPickerInput: FC<CollectionsPickerInputProps> = ({
  name,
  collections,
}) => {
  const [showAddCollections, setShowAddCollections] = useState(false)
  const formMethods = useFormContext()
  const {
    fields: items,
    remove,
    replace,
    move,
  } = useFieldArray({
    control: formMethods.control,
    name,
  })

  const removeItem = useCallback((index) => remove(index), [remove])

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over?.id) return
    if (active.id === over.id) return

    const oldIndex = items.findIndex((f) => f.id === active.id)
    const newIndex = items.findIndex((f) => f.id === over?.id)

    move(oldIndex, newIndex)
  }

  const handlePickCollections = async (selectedCollectionIds: string[]) => {
    let previousCollectionIds = formMethods.getValues(name) || []

    const newCollectionIds = difference(
      selectedCollectionIds,
      previousCollectionIds
    )

    const removedCollectionIds = difference(
      previousCollectionIds,
      selectedCollectionIds
    )

    previousCollectionIds = previousCollectionIds.filter(
      (id) => !removedCollectionIds.includes(id)
    )

    // Combine previous and new collection ids, maintaining sort order.
    const updatedCollectionIds = [...previousCollectionIds, ...newCollectionIds]

    replace(updatedCollectionIds.map((id) => ({ value: id })))

    setShowAddCollections(false)
  }

  const initialSelectedCollectionIds = items.map((i: any) => i.value)

  const DragOverlayItem = ({ item }: { item: { value: string } }) => {
    const collection = collections.find((c) => c.id === item?.value)

    if (!collection) return null

    return (
      <CollectionItem
        item={collection}
        className="!bg-white !border-grey-30 shadow-dropdown"
      >
        <GripIcon className="w-4 h-4 text-grey-40" />
      </CollectionItem>
    )
  }

  return (
    <>
      <div className="bg-grey-5 border border-grey-20 rounded-rounded">
        <Sortable
          items={items}
          sortingStrategy={rectSortingStrategy}
          collisionDetection={pointerWithin}
          dragOverlayItem={DragOverlayItem}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col">
            {!!items.length && (
              <>
                <div className="flex flex-col p-1.5">
                  {items.map((item: any, index) => {
                    const collection = collections.find(
                      (c) => c.id === item.value
                    )

                    if (!collection) return null

                    return (
                      <SortableItem
                        key={item.id}
                        id={item.id}
                        handle
                        className={({ isDragging }) =>
                          clsx("flex h-full p-0.5", {
                            "opacity-50": isDragging,
                          })
                        }
                      >
                        <CollectionItem
                          item={collection}
                          onClick={() => removeItem(index)}
                        >
                          <SortableItemHandle>
                            <GripIcon className="w-4 h-4 text-grey-40 !cursor-grab active:!cursor-grabbing" />
                          </SortableItemHandle>
                        </CollectionItem>
                      </SortableItem>
                    )
                  })}
                </div>

                <div className="pb-1.5 px-2.5 text-grey-50 text-small">
                  Drag and drop to change sort order.
                </div>

                <hr className="m-0 border-grey-20" />
              </>
            )}

            <div className={clsx("flex flex-wrap items-center p-1.5 gap-2")}>
              <div>
                <Button
                  size="small"
                  variant="secondary"
                  className={clsx("pl-2")}
                  onClick={() => setShowAddCollections(true)}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add {!items.length ? <>tabs</> : <>more tabs</>}</span>
                </Button>
              </div>

              <div className="px-1 text-grey-50 text-small">
                {!items.length && <>All collections will show by default.</>}
              </div>
            </div>
          </div>
        </Sortable>
      </div>

      {showAddCollections && (
        <AddCollectionsModal
          onClose={() => setShowAddCollections(false)}
          onSave={handlePickCollections}
          initialSelection={initialSelectedCollectionIds}
        />
      )}
    </>
  )
}

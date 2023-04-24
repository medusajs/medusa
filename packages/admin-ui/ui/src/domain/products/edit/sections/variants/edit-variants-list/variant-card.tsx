import { type Price, Product, ProductVariant } from "@medusajs/medusa"
import clsx from "clsx"
import type { Identifier, XYCoord } from "dnd-core"
import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Controller, useFormContext } from "react-hook-form"
import Button from "../../../../../../components/fundamentals/button"
import EditIcon from "../../../../../../components/fundamentals/icons/edit-icon"
import GripIcon from "../../../../../../components/fundamentals/icons/grip-icon"
import MoreHorizontalIcon from "../../../../../../components/fundamentals/icons/more-horizontal-icon"
import Actionables, {
  ActionType,
} from "../../../../../../components/molecules/actionables"
import InputField from "../../../../../../components/molecules/input"
import { DragItem } from "../../../../../../types/shared"
import FormValidator from "../../../../../../utils/form-validator"
// import PriceFormInput from "../../../../components/prices-form/price-form-input"
import TrashIcon from "../../../../../../components/fundamentals/icons/trash-icon"
import { currencies } from "../../../../../../utils/currencies"
import { VariantItem } from "../edit-variants-modal"
import PriceFormInput from "../../../../components/prices-form/price-form-input"

const ItemTypes = {
  CARD: "card",
}

export type VariantCardProps = {
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  product: Product
  actions: {
    deleteVariant: (variantId: string) => void
    duplicateVariant: (variant: ProductVariant) => void
    updateVariant: (variant: ProductVariant) => void
  }
} & VariantItem

export const VariantCard = ({
  id,
  index,
  ean,
  sku,
  title,
  moveCard,
  product,
  actions,
}: VariantCardProps) => {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext()

  const { updateVariant, deleteVariant } = actions

  const actionList: ActionType[] = [
    {
      label: "Edit Variant",
      icon: <EditIcon size={20} className="text-grey-50" />,
      onClick: () => {
        const variant = product.variants.find((v) => v.id === id)
        if (!variant) return
        updateVariant(variant)
      },
    },
    {
      label: "Delete Variant",
      icon: <TrashIcon size={20} className="text-grey-50" />,
      onClick: () => deleteVariant(id),
    },
  ]

  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  const currentVariant = product.variants.find((v) => v.id === id)

  if (!currentVariant) return null

  const manageInventory = currentVariant.manage_inventory
  const inventoryQuantity = getValues(`variants.${id}.inventory_quantity`)

  return (
    <div
      ref={preview}
      data-handler-id={handlerId}
      className={clsx(
        "grid grid-cols-[32px_1fr_100px_120px_48px] transition-all rounded-rounded hover:bg-grey-5 focus-within:bg-grey-5 h-16 py-xsmall pl-xsmall pr-base translate-y-0 translate-x-0",
        {
          "bg-grey-5 opacity-50": isDragging,
        }
      )}
    >
      <div
        className="text-grey-40 cursor-move flex items-center justify-center"
        ref={ref}
      >
        <GripIcon size={20} />
      </div>
      <div className="flex flex-col text-left ml-base justify-center">
        <p className="inter-base-semibold">
          {title}
          {sku && (
            <span className="text-grey-50 inter-base-regular">({sku})</span>
          )}
        </p>
        {ean && <span className="inter-base-regular text-grey-50">{ean}</span>}
      </div>

      <div className="text-right flex items-center mr-2">
        <Controller
          name={`variants.${id}.prices[0].amount`}
          control={control}
          render={({ field, formState: { errors } }) => {
            return (
              <PriceFormInput
                {...field}
                amount={field.value}
                currencyCode={
                  (product.prices && product.prices[0].currency_code) || "USD"
                }
                errors={errors}
              />
            )
          }}
        />
      </div>

      <div className="text-right flex items-center">
        {manageInventory ? (
          <InputField
            {...register(`variants.${id}.inventory_quantity`, {
              min: FormValidator.nonNegativeNumberRule("Inventory"),
              valueAsNumber: true,
            })}
            value={inventoryQuantity || undefined}
            type="number"
            placeholder="# quantity"
            className="max-w-[112px] [&>div]:pr-2"
            disabled={!manageInventory}
            errors={errors}
          />
        ) : (
          <InputField
            className="max-w-[112px] [&>div]:pr-2 opacity-50 pointer-events-none"
            value={undefined}
            placeholder="∞"
            disabled
          />
        )}
      </div>

      <div className="ml-xlarge flex items-center justify-center pr-base">
        <Actionables
          forceDropdown
          actions={actionList}
          customTrigger={
            <Button
              variant="ghost"
              className="w-xlarge h-xlarge p-0 flex items-center justify-center text-grey-50"
            >
              <MoreHorizontalIcon size={20} />
            </Button>
          }
        />
      </div>
    </div>
  )
}

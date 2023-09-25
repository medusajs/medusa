import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import type { Identifier, XYCoord } from "dnd-core"
import { useContext, useMemo, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { VariantItem } from "."
import { DragItem } from "../../../../types/shared"
import FormValidator from "../../../../utils/form-validator"
import Button from "../../../fundamentals/button"
import EditIcon from "../../../fundamentals/icons/edit-icon"
import GripIcon from "../../../fundamentals/icons/grip-icon"
import MoreHorizontalIcon from "../../../fundamentals/icons/more-horizontal-icon"
import Actionables, { ActionType } from "../../../molecules/actionables"
import InputField from "../../../molecules/input"
import { LayeredModalContext } from "../../../molecules/modal/layered-modal"
import { useEditVariantScreen } from "./edit-variant-screen"

const ItemTypes = {
  CARD: "card",
}

export type VariantCardProps = {
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  product: Product
} & VariantItem

export const VariantCard = ({
  id,
  index,
  ean,
  sku,
  title,
  moveCard,
  product,
}: VariantCardProps) => {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const editVariantScreen = useEditVariantScreen({
    product,
    variant: product.variants.find((v) => v.id === id)!,
  })
  const { push } = useContext(LayeredModalContext)

  const actions: ActionType[] = useMemo(() => {
    return [
      {
        label: t("edit-variants-modal-edit-variant", "Edit Variant"),
        icon: <EditIcon size={20} className="text-grey-50" />,
        onClick: () => push(editVariantScreen),
      },
    ]
  }, [editVariantScreen, push])

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

  return (
    <div
      ref={preview}
      data-handler-id={handlerId}
      className={clsx(
        "rounded-rounded hover:bg-grey-5 focus-within:bg-grey-5 py-xsmall pl-xsmall pr-base grid h-16 translate-y-0 translate-x-0 grid-cols-[32px_1fr_1fr_48px] transition-all",
        {
          "bg-grey-5 opacity-50": isDragging,
        }
      )}
    >
      <div
        className="text-grey-40 flex cursor-move items-center justify-center"
        ref={ref}
      >
        <GripIcon size={20} />
      </div>
      <div className="ml-base flex flex-col justify-center text-left">
        <p className="inter-base-semibold">
          {title}
          {sku && (
            <span className="text-grey-50 inter-base-regular">({sku})</span>
          )}
        </p>
        {ean && <span className="inter-base-regular text-grey-50">{ean}</span>}
      </div>
      <div className="flex items-center justify-end text-right">
        <InputField
          {...register(`variants.${index}.inventory_quantity`, {
            min: FormValidator.nonNegativeNumberRule("Inventory"),
            valueAsNumber: true,
          })}
          type="number"
          placeholder="100..."
          className="max-w-[200px]"
          errors={errors}
        />
      </div>
      <div className="ml-xlarge pr-base flex items-center justify-center">
        <Actionables
          forceDropdown
          actions={actions}
          customTrigger={
            <Button
              variant="ghost"
              className="w-xlarge h-xlarge text-grey-50 flex items-center justify-center p-0"
            >
              <MoreHorizontalIcon size={20} />
            </Button>
          }
        />
      </div>
    </div>
  )
}

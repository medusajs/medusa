import { useMemo } from "react"
import { Control, FieldPath, FieldValues, useWatch } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import MinusIcon from "../../../components/fundamentals/icons/minus-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"

type TableQuantitySelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  index: number
  updateQuantity: (index: number, change: number) => void
  control: Control<TFieldValues>
  name: TFieldName
  maxQuantity?: number
} & (
  | {
      isSelectable: true
      isSelectedPath: TFieldName
    }
  | {
      isSelectable?: false
      isSelectedPath?: never
    }
)

const TableQuantitySelector = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  isSelectedPath,
  isSelectable = false,
  updateQuantity,
  index,
  maxQuantity,
}: TableQuantitySelectorProps<TFieldValues, TFieldName>) => {
  const currentQuantity = useWatch({
    control,
    name: name,
  })

  const isSelected = useWatch({
    control,
    name: isSelectedPath as TFieldName,
    disabled: !isSelectedPath || !isSelectable,
  })

  const quantityFlag = useMemo(() => {
    return isSelectable ? isSelected && (maxQuantity ?? 0) > 1 : true
  }, [isSelectable, isSelected, maxQuantity])

  return (
    <div className="flex items-center justify-end">
      {quantityFlag ? (
        <div className="inter-small-regular gap-x-2xsmall text-grey-50 grid grid-cols-3">
          <Button
            variant="ghost"
            size="small"
            type="button"
            onClick={() => updateQuantity(index, -1)}
            disabled={currentQuantity === 1}
            className="h-large w-large rounded-base disabled:text-grey-30"
            aria-label="Decrease quantity"
          >
            <MinusIcon size={16} />
          </Button>
          <div className="flex items-center justify-center">
            <p aria-label="Quantity">{currentQuantity}</p>
          </div>
          <Button
            variant="ghost"
            size="small"
            type="button"
            onClick={() => updateQuantity(index, 1)}
            disabled={maxQuantity ? currentQuantity === maxQuantity : undefined}
            className="h-large w-large rounded-base disabled:text-grey-30"
            aria-label="Increase quantity"
          >
            <PlusIcon size={16} />
          </Button>
        </div>
      ) : (
        <p className="inter-small-regular text-grey-50">{currentQuantity}</p>
      )}
    </div>
  )
}

export default TableQuantitySelector

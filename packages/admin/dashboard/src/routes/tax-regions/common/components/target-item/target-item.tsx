import { XMarkMini } from "@medusajs/icons"
import { IconButton, Text } from "@medusajs/ui"
import { useProduct } from "../../../../../hooks/api"

type TargetItemProps = {
  index: number
  onRemove: (index: number) => void
  label: string
  value: string
}

export const TargetItem = ({
  index,
  label,
  onRemove,
  value,
}: TargetItemProps) => {
  const { product } = useProduct(
    value,
    {
      // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
      fields:
        "id,title,-type,-collection,-options,-tags,-images,-variants,-sales_channels",
    },
    { enabled: !label }
  )

  return (
    <div className="bg-ui-bg-field-component shadow-borders-base flex items-center justify-between gap-2 rounded-md px-2 py-0.5">
      <Text size="small" leading="compact">
        {label || product?.title}
      </Text>
      <IconButton
        size="small"
        variant="transparent"
        type="button"
        onClick={() => onRemove(index)}
      >
        <XMarkMini />
      </IconButton>
    </div>
  )
}

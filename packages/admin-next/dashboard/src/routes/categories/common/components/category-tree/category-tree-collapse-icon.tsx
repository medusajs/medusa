import { TriangleRightMini } from "@medusajs/icons"
import { IconButton, clx } from "@medusajs/ui"
import { MouseEvent } from "react"
import { Item } from "react-nestable"

type CategoryTreeCollapseIconProps = {
  item: Item
  isCollapsed: boolean
  toggle: (item: Item) => void
  disabled?: boolean
}

export const CategoryTreeCollapseIcon = ({
  item,
  isCollapsed,
  toggle,
  disabled,
}: CategoryTreeCollapseIconProps) => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    toggle(item)
  }

  return (
    <IconButton
      size="small"
      variant="transparent"
      type="button"
      onClick={handleClick}
      disabled={disabled}
    >
      <TriangleRightMini
        className={clx({
          "rotate-90 transform transition-transform": !isCollapsed,
        })}
      />
    </IconButton>
  )
}

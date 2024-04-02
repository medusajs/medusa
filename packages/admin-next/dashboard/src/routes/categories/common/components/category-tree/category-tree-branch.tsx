import { Folder, Swatch } from "@medusajs/icons"
import { ProductCategory } from "@medusajs/medusa"
import { Text, clx } from "@medusajs/ui"
import { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ItemMenuCompoment } from "./types"

type CategoryTreeBranchProps = {
  item: ProductCategory
  depth: number
  isDraggable: boolean
  isEnabled: boolean
  collapseIcon: ReactNode
  handler: ReactNode
  menu?: ItemMenuCompoment
  asLink?: boolean
}

export const CategoryTreeBranch = ({
  item,
  depth,
  isEnabled,
  collapseIcon,
  handler,
  menu,
  asLink = false,
}: CategoryTreeBranchProps) => {
  const hasChildren = !!item.category_children?.length

  const Component = (
    <div
      data-disabled={!isEnabled}
      className={clx(
        "bg-ui-bg-base hover:bg-ui-bg-base-hover transition-fg group flex h-12 items-center gap-x-3 border-b px-6 py-2.5",
        {
          "bg-ui-bg-disabled hover:bg-ui-bg-disabled": !isEnabled,
        }
      )}
    >
      <div>{handler}</div>
      {Array.from({ length: depth }).map((_, i) => (
        <div key={`offset_${i}`} role="presentation" className="h-7 w-7" />
      ))}
      <div className="h-7 w-7">{collapseIcon}</div>
      <div
        className="text-ui-fg-muted flex h-7 w-7 items-center justify-center"
        role="presentation"
      >
        {hasChildren ? <Folder /> : <Swatch />}
      </div>
      <div className="flex w-full items-center justify-between">
        <div>
          <Text size="small" leading="compact">
            {item.name}
          </Text>
        </div>
        {renderMenu(item, menu)}
      </div>
    </div>
  )

  if (asLink) {
    return (
      <Link
        to={`/categories/${item.id}`}
        className="[&:focus-visible>div]:bg-ui-bg-highlight [&:focus-visible:hover>div]:bg-ui-bg-highlight-hover outline-none"
      >
        {Component}
      </Link>
    )
  }

  return Component
}

const renderMenu = (item: ProductCategory, Menu?: ItemMenuCompoment) => {
  if (!Menu) {
    return null
  }

  return <Menu item={item} />
}

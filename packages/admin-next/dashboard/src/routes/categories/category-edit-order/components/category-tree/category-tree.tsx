import { DotsSix, Folder, Swatch, TriangleDownMini } from "@medusajs/icons"
import type { ProductCategory } from "@medusajs/medusa"
import { IconButton } from "@medusajs/ui"
import { ReactNode } from "react"
import Nestable from "react-nestable"

import "react-nestable/dist/styles/index.css"
import "./styles.css"

type CategoryTreeProps = {
  categories: ProductCategory[]
}

const MAX_DEPTH = 99

export const CategoryTree = ({ categories }: CategoryTreeProps) => {
  return (
    <div className="txt-compact-small relative">
      <Nestable
        items={categories}
        childrenProp="category_children"
        maxDepth={MAX_DEPTH}
        renderItem={({ index, item, ...props }) => {
          return <Leaf key={index} item={item as ProductCategory} {...props} />
        }}
        handler={<DragHandle />}
        renderCollapseIcon={({ isCollapsed }) => {
          return (
            <IconButton size="small" variant="transparent">
              <TriangleDownMini />
            </IconButton>
          )
        }}
      />
    </div>
  )
}

type LeafProps = {
  item: ProductCategory
  depth: number
  isDraggable: boolean
  collapseIcon: ReactNode
  handler: ReactNode
}

const Leaf = ({
  item,
  depth,
  isDraggable,
  collapseIcon,
  handler,
}: LeafProps) => {
  const hasChildren = !!item.category_children?.length

  return (
    <div className="flex items-center px-6 py-2.5 border-b gap-x-3 h-12 bg-ui-bg-base">
      <div>{handler}</div>
      {Array.from({ length: depth }).map((_, i) => (
        <div key={`offset_${i}`} role="presentation" className="w-7 h-7" />
      ))}
      {collapseIcon}
      <div className="flex items-center justify-center text-ui-fg-muted w-7 h-7">
        {hasChildren ? <Folder /> : <Swatch />}
      </div>
      <div>{item.name}</div>
    </div>
  )
}

const DragHandle = () => {
  return (
    <div className="cursor-grab active:cursor-grabbing w-7 h-7 flex items-center justify-center">
      <DotsSix className="text-ui-fg-subtle" />
    </div>
  )
}

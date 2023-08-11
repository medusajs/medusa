import React from "react"
import { ProductCategory } from "@medusajs/medusa"
import { getAncestors } from "../utils"

type TreeCrumbsProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  nodes: ProductCategory[]
  currentNode: ProductCategory
  showPlaceholder: boolean
  placeholderText: string
}

const TreeCrumbs: React.FC<TreeCrumbsProps> = ({
  nodes,
  currentNode,
  showPlaceholder = false,
  placeholderText = "",
  ...props
}) => {
  const ancestors = getAncestors(currentNode, nodes)

  return (
    <span {...props}>
      <span className="text-grey-40">
        {ancestors.map((ancestor, index) => {
          const categoryName = ancestor.name

          return (
            <div key={ancestor.id} className="inline-block">
              <span>
                {categoryName.length > 25
                  ? categoryName.substring(0, 25) + "..."
                  : categoryName}
              </span>

              {(showPlaceholder || ancestors.length !== index + 1) && (
                <span className="mx-2">/</span>
              )}
            </div>
          )
        })}

        {showPlaceholder && (
          <span>
            <span className="border-grey-40 rounded-[10px] border-[1px] border-dashed px-[8px] py-[4px]">
              {placeholderText}
            </span>
          </span>
        )}
      </span>
    </span>
  )
}

export default TreeCrumbs

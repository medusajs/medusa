import React from "react"
import { ProductCategory } from "@medusajs/medusa"

type TreeCrumbsProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  nodes: ProductCategory
  currentNode: ProductCategory
}

const TreeCrumbs: React.FC<TreeCrumbsProps> = ({
  nodes,
  currentNode,
  showPlaceholder = false,
  ...props
}) => {
  const parentNode = nodes.find((n) => n.id === currentNode?.parent_category_id)

  return (
    <span {...props}>
      <span className="text-grey-40">
        {parentNode && (
          <TreeCrumbs
            nodes={nodes}
            currentNode={parentNode}
            showPlaceholder={false}
          />
        )}

        {parentNode && <span className="mx-2">/</span>}

        {currentNode.name}

        {showPlaceholder && (
          <span>
            <span className="mx-2">/</span>

            <span className="border-grey-40 rounded-[10px] border-[1px] border-dashed px-[8px] py-[4px]">
              New
            </span>
          </span>
        )}
      </span>
    </span>
  )
}

export default TreeCrumbs

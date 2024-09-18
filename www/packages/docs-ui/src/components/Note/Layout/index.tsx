import React, { useMemo } from "react"
import { NoteProps } from ".."
import clsx from "clsx"
import { MarkdownContent } from "../../.."

type StringInfo = {
  allStringChildren: boolean
  stringChildren: string[]
}

type NoteLayoutProps = NoteProps

export const NoteLayout = ({ type, title, children }: NoteLayoutProps) => {
  const getStringInfoFromChildren = (nodes: React.ReactNode): StringInfo => {
    let allStringChildren = true
    const stringChildren: string[] = []

    React.Children.forEach(nodes, (child) => {
      if (!allStringChildren) {
        return
      } else if (["string", "number"].includes(typeof child)) {
        stringChildren.push(`${child}`)
      } else if (Array.isArray(child)) {
        const childInfo = getStringInfoFromChildren(child)
        allStringChildren = childInfo.allStringChildren
        stringChildren.push(...childInfo.stringChildren)
      } else if (
        React.isValidElement(child) &&
        typeof child.props === "object" &&
        child.props &&
        "children" in child.props &&
        child.props.children
      ) {
        const typeStr = child.type.toString()
        if (typeStr.includes(`"li"`)) {
          allStringChildren = false
          return
        } else if (
          "href" in child.props &&
          typeof child.props.children === "string"
        ) {
          stringChildren.push(`[${child.props.children}](${child.props.href})`)
          return
        } else if (
          typeStr.includes("InlineCode") &&
          typeof child.props.children === "string"
        ) {
          stringChildren.push(`\`${child.props.children}\``)
          return
        }

        const childInfo = getStringInfoFromChildren(
          child.props.children as React.ReactNode
        )
        allStringChildren = childInfo.allStringChildren
        stringChildren.push(...childInfo.stringChildren)
      }
    })

    return {
      allStringChildren,
      stringChildren,
    }
  }
  const { allStringChildren, stringChildren } = useMemo(() => {
    const { allStringChildren, stringChildren } =
      getStringInfoFromChildren(children)

    return {
      allStringChildren,
      stringChildren: stringChildren.join(" "),
    }
  }, [children])

  return (
    <div
      className={clsx(
        "py-[10px] px-docs_0.75 my-docs_1",
        "flex gap-docs_0.75 rounded-docs_DEFAULT items-stretch",
        "bg-medusa-bg-component border border-medusa-border-base"
      )}
    >
      <span
        className={clsx(
          "rounded-full w-docs_0.25",
          // TODO remove once we use the new prerequisites component across docs
          (type === "default" || type === "check") &&
            "bg-medusa-tag-neutral-icon",
          (type === "error" || type === "warning") && "bg-medusa-tag-red-icon",
          type === "success" && "bg-medusa-tag-green-icon",
          // TODO remove once all soon components are removed
          type === "soon" && "bg-medusa-tag-blue-icon"
        )}
      ></span>
      <div className="flex-1">
        <div className="text-small text-medusa-fg-subtle [&_ol]:!mb-0 [&_ul]:!mb-0">
          <span className={clsx("text-small-plus text-medusa-fg-base")}>
            {title}:&nbsp;
          </span>
          {allStringChildren && (
            <MarkdownContent
              allowedElements={["a", "code"]}
              unwrapDisallowed={true}
            >
              {stringChildren}
            </MarkdownContent>
          )}
          {!allStringChildren && children}
        </div>
      </div>
    </div>
  )
}

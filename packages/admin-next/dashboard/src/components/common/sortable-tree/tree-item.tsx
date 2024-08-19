import React, { forwardRef, HTMLAttributes, ReactNode } from "react"

import {
  DotsSix,
  FolderIllustration,
  FolderOpenIllustration,
  Swatch,
  TriangleRightMini,
} from "@medusajs/icons"
import { Badge, clx, IconButton } from "@medusajs/ui"
import { HandleProps } from "./types"

export interface TreeItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  childCount?: number
  clone?: boolean
  collapsed?: boolean
  depth: number
  disableInteraction?: boolean
  disableSelection?: boolean
  ghost?: boolean
  handleProps?: HandleProps
  indentationWidth: number
  value: ReactNode
  disabled?: boolean
  onCollapse?(): void
  wrapperRef?(node: HTMLLIElement): void
}

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      collapsed,
      onCollapse,
      style,
      value,
      disabled,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <li
        ref={wrapperRef}
        style={
          {
            paddingLeft: `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        className={clx("-mb-px list-none", {
          "pointer-events-none": disableInteraction,
          "select-none": disableSelection,
          "[&:first-of-type>div]:border-t-0": !clone,
        })}
        {...props}
      >
        <div
          ref={ref}
          style={style}
          className={clx(
            "bg-ui-bg-base transition-fg relative flex items-center gap-x-3 border-y px-6 py-2.5",
            {
              "border-l": depth > 0,
              "shadow-elevation-flyout bg-ui-bg-base w-fit rounded-lg border-none pr-6 opacity-80":
                clone,
              "bg-ui-bg-base-hover z-[1] opacity-50": ghost,
              "bg-ui-bg-disabled": disabled,
            }
          )}
        >
          <Handle {...handleProps} disabled={disabled} />
          <Collapse
            collapsed={collapsed}
            onCollapse={onCollapse}
            clone={clone}
          />
          <Icon
            childrenCount={childCount}
            collapsed={collapsed}
            clone={clone}
          />
          <Value value={value} />
          <ChildrenCount clone={clone} childrenCount={childCount} />
        </div>
      </li>
    )
  }
)
TreeItem.displayName = "TreeItem"

const Handle = ({
  listeners,
  attributes,
  disabled,
}: HandleProps & { disabled?: boolean }) => {
  return (
    <IconButton
      size="small"
      variant="transparent"
      type="button"
      className={clx("cursor-grab", { "cursor-not-allowed": disabled })}
      disabled={disabled}
      {...attributes}
      {...listeners}
    >
      <DotsSix />
    </IconButton>
  )
}

type IconProps = {
  childrenCount?: number
  collapsed?: boolean
  clone?: boolean
}

const Icon = ({ childrenCount, collapsed, clone }: IconProps) => {
  const isBranch = clone ? childrenCount && childrenCount > 1 : childrenCount
  const isOpen = clone ? false : !collapsed

  return (
    <div className="flex size-7 items-center justify-center">
      {isBranch ? (
        isOpen ? (
          <FolderOpenIllustration />
        ) : (
          <FolderIllustration />
        )
      ) : (
        <Swatch className="text-ui-fg-muted" />
      )}
    </div>
  )
}

type CollapseProps = {
  collapsed?: boolean
  onCollapse?: () => void
  clone?: boolean
}

const Collapse = ({ collapsed, onCollapse, clone }: CollapseProps) => {
  if (clone) {
    return null
  }

  if (!onCollapse) {
    return <div className="size-7" role="presentation" />
  }

  return (
    <IconButton
      size="small"
      variant="transparent"
      onClick={onCollapse}
      type="button"
    >
      <TriangleRightMini
        className={clx("text-ui-fg-subtle transition-transform", {
          "rotate-90": !collapsed,
        })}
      />
    </IconButton>
  )
}

type ValueProps = {
  value: ReactNode
}

const Value = ({ value }: ValueProps) => {
  return (
    <div className="txt-compact-small text-ui-fg-subtle flex-grow truncate">
      {value}
    </div>
  )
}

type ChildrenCountProps = {
  clone?: boolean
  childrenCount?: number
}

const ChildrenCount = ({ clone, childrenCount }: ChildrenCountProps) => {
  if (!clone || !childrenCount) {
    return null
  }

  if (clone && childrenCount <= 1) {
    return null
  }

  return (
    <Badge size="2xsmall" color="blue" className="absolute -right-2 -top-2">
      {childrenCount}
    </Badge>
  )
}

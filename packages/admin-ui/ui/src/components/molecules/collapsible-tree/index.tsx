import React from "react"
import clsx from "clsx"

import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import Button from "../../fundamentals/button"
import Actionables, { ActionType } from "../actionables"

/* ---------------------------- CollapsibleTree ------------------------------------ */

type CollapsibleTreeType = React.FC & {
  Parent: React.FC<CollapsibleTreeParentProps>
  Leaf: React.FC<CollapsibleTreeLeafProps>
  Content: React.FC<CollapsibleTreeContentProps>
}

type TCollapsibleTreeContext = {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
  toggle: () => void
}

const CollapsibleTreeContext =
  React.createContext<TCollapsibleTreeContext | null>(null)

export const CollapsibleTree: CollapsibleTreeType = ({ children }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <CollapsibleTreeContext.Provider
      value={{
        open,
        handleOpen: () => setOpen(true),
        handleClose: () => setOpen(false),
        toggle: () => setOpen((open) => !open),
      }}
    >
      {children}
    </CollapsibleTreeContext.Provider>
  )
}

CollapsibleTreeContext.displayName = "CollapsibleTreeContext"

const useCollapsibleTree = () => {
  const context = React.useContext(CollapsibleTreeContext)
  if (!context) {
    throw new Error("useCollapsibleTree must be a child of CollapsibleTree")
  }
  return context
}

/* ---------------------------- CollapsibleTreeContent ------------------------------------ */

type CollapsibleTreeContentProps = React.HTMLAttributes<HTMLDivElement>

const CollapsibleTreeContent: React.FC<CollapsibleTreeContentProps> = ({
  children,
  className,
  ...props
}) => {
  const { open } = useCollapsibleTree()
  return (
    <div
      className={clsx(
        "mt-xsmall pl-5",
        {
          hidden: !open,
          "animate-fade-in-top": open,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

CollapsibleTree.Content = CollapsibleTreeContent

/* ---------------------------- CollapsibleTreeParent ------------------------------------ */

type CollapsibleTreeParentProps = {
  actions?: ActionType[]
  className?: string
}

const CollapsibleTreeParent: React.FC<CollapsibleTreeParentProps> = ({
  actions,
  className,
  children,
}) => {
  const { open, toggle } = useCollapsibleTree()
  return (
    <div>
      <Container className={className}>
        <div className="flex items-center justify-between">
          <div className="gap-x-small flex items-center">{children}</div>
          <div className="gap-x-xsmall flex items-center">
            {actions && (
              <Actionables customTrigger={Trigger()} actions={actions} />
            )}
            <div className="rounded-circle bg-grey-20 h-5 w-px" />
            <Button
              variant="ghost"
              size="small"
              className="text-grey-50 p-[6px]"
              onClick={toggle}
            >
              {open ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

CollapsibleTree.Parent = CollapsibleTreeParent

/* ---------------------------- CollapsibleTreeLeaf ------------------------------------ */

type CollapsibleTreeLeafProps = {
  actions?: ActionType[]
  className?: string
}

const CollapsibleTreeLeaf: React.FC<CollapsibleTreeLeafProps> = ({
  className,
  children,
  actions,
}) => {
  return (
    <div
      className={clsx(
        "col-tree pb-xsmall relative flex items-center last:pb-0",
        className
      )}
    >
      <div className="absolute top-0 left-0 bottom-0">
        <div className="border-grey-20 h-1/2 w-px border-l border-dashed" />
        <div className="border-grey-20 bottom-half-dash h-1/2 w-px border-l border-dashed" />
      </div>
      <div className="border-grey-20 mr-xsmall h-px w-[13px] border-t border-dashed" />
      <Container className="inter-small-regular flex w-full items-center justify-between">
        {children}
        {actions && (
          <Actionables
            forceDropdown
            customTrigger={Trigger()}
            actions={actions}
          />
        )}
      </Container>
    </div>
  )
}

CollapsibleTree.Leaf = CollapsibleTreeLeaf

const Container: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "rounded-rounded border-grey-20 py-2xsmall px-small border",
        className
      )}
    >
      {children}
    </div>
  )
}

const Trigger = () => {
  return (
    <Button variant="ghost" size="small" className="text-grey-50 p-[6px]">
      <MoreHorizontalIcon size={20} />
    </Button>
  )
}

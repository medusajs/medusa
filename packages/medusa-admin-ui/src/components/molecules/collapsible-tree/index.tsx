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

const CollapsibleTreeContext = React.createContext<TCollapsibleTreeContext | null>(
  null
)

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
        "pl-5 mt-xsmall",
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
          <div className="flex items-center gap-x-xsmall">
            {actions && (
              <Actionables customTrigger={Trigger()} actions={actions} />
            )}
            <div className="h-5 w-px rounded-circle bg-grey-20" />
            <Button
              variant="ghost"
              size="small"
              className="p-[6px] text-grey-50"
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
        "col-tree flex items-center relative pb-xsmall last:pb-0",
        className
      )}
    >
      <div className="absolute top-0 left-0 bottom-0">
        <div className="border-l border-dashed border-grey-20 h-1/2 w-px" />
        <div className="h-1/2 border-l border-dashed border-grey-20 w-px bottom-half-dash" />
      </div>
      <div className="w-[13px] h-px border-t border-grey-20 border-dashed mr-xsmall" />
      <Container className="w-full flex items-center justify-between inter-small-regular">
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
        "rounded-rounded border border-grey-20 py-2xsmall px-small",
        className
      )}
    >
      {children}
    </div>
  )
}

const Trigger = () => {
  return (
    <Button variant="ghost" size="small" className="p-[6px] text-grey-50">
      <MoreHorizontalIcon size={20} />
    </Button>
  )
}

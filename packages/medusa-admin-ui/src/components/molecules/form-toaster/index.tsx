import * as Dropdown from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import React, { Children, HTMLAttributes, useMemo } from "react"
import { Toast } from "react-hot-toast"
import Spinner from "../../atoms/spinner"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"

type FormToasterContainerProps = {
  toast?: Toast
  isLoading?: boolean
  loadingMessage?: string
  unsavedChangesMessage?: string
  icon?: React.ReactNode
}

type MultiActionButtonProps = {
  actions: {
    onClick: () => void | Promise<void>
    label: string
    icon?: any
  }[]
  className?: string
}

const FormToasterContainer: React.FC<FormToasterContainerProps> & {
  Actions: React.FC
  DiscardButton: React.FC<HTMLAttributes<HTMLButtonElement>>
  ActionButton: React.FC<HTMLAttributes<HTMLButtonElement>>
  MultiActionButton: React.FC<MultiActionButtonProps>
} = ({
  children,
  toast,
  isLoading = false,
  loadingMessage = "Hang on, this may take a few moments...",
  unsavedChangesMessage = "You have unsaved changes",
  icon = <RefreshIcon size="20" />,
}) => {
  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex items-center p-base gap-x-base">
          <span>
            <Spinner />
          </span>
          <span className="inter-small-regular">{loadingMessage}</span>
        </div>
      )
    } else {
      return (
        <>
          <div className="flex items-center p-base gap-x-base">
            <span>{icon}</span>
            <span className="inter-small-regular">{unsavedChangesMessage}</span>
          </div>
          {children}
        </>
      )
    }
  }, [isLoading, children])

  return (
    <div
      className={clsx({
        "animate-enter": toast?.visible,
        "animate-leave": !toast?.visible,
      })}
      {...toast?.ariaProps}
    >
      <div className="flex items-center rounded-rounded bg-grey-90 h-[72px] w-[344px] text-grey-0 justify-between">
        {content}
      </div>
    </div>
  )
}

const Actions: React.FC = ({ children }) => {
  return (
    <div className="border-l border-grey-70 h-full">
      {Children.map(children, (child) => {
        return (
          <div className="flex items-center justify-center border-b border-grey-70 last:border-none h-1/2 w-[72px]">
            {child}
          </div>
        )
      })}
    </div>
  )
}

const DiscardButton: React.FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex items-center justify-center text-white inter-small-semibold h-full w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const ActionButton: React.FC<HTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex items-center justify-center text-white inter-small-semibold h-full w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const MultiActionButton: React.FC<MultiActionButtonProps> = ({
  children,
  className,
  actions,
}) => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className={clsx(
          "inter-small-semibold flex items-center justify-center h-full w-full",
          className
        )}
      >
        {children}
        <ChevronDownIcon size={16} className="ml-[2px]" />
      </Dropdown.Trigger>

      <Dropdown.Content
        className="rounded-rounded flex bg-grey-90 text-white p-xsmall flex-col min-w-[208px]"
        sideOffset={10}
      >
        {actions.map((action, i) => {
          return (
            <Dropdown.Item key={i}>
              <button
                onClick={action.onClick}
                className="p-2xsmall hover:bg-grey-80 hover:outline-none inter-small-semibold rounded-base text-left flex items-center w-full"
              >
                {action.icon && (
                  <span className="text-grey-0 mr-xsmall">
                    {React.cloneElement(action.icon, {
                      size: 20,
                    })}
                  </span>
                )}
                {action.label}
              </button>
            </Dropdown.Item>
          )
        })}
      </Dropdown.Content>
    </Dropdown.Root>
  )
}

FormToasterContainer.Actions = Actions
FormToasterContainer.DiscardButton = DiscardButton
FormToasterContainer.ActionButton = ActionButton
FormToasterContainer.MultiActionButton = MultiActionButton

export default FormToasterContainer

"use client"

import clsx from "clsx"
import React, { Children, ReactElement, useRef } from "react"
import { NotificationItemLayoutDefault } from "./Layout/Default"
// @ts-expect-error can't install the types package because it doesn't support React v19
import { CSSTransition } from "react-transition-group"

export type NotificationItemProps = {
  layout?: "default" | "empty"
  type?: "info" | "error" | "warning" | "success" | "custom" | "none"
  CustomIcon?: React.ReactNode
  title?: string
  text?: string
  className?: string
  children?: ReactElement
  isClosable?: boolean
  placement?: "top" | "bottom"
  show?: boolean
  setShow?: (value: boolean) => void
  onClose?: () => void
  closeButtonText?: string
} & React.HTMLAttributes<HTMLDivElement>

type EmptyLayoutProps = {
  onClose?: () => void
}

export const NotificationItem = ({
  className = "",
  placement = "bottom",
  show = true,
  layout = "default",
  setShow,
  onClose,
  children,
  ...rest
}: NotificationItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const handleClose = () => {
    setShow?.(false)
    onClose?.()
  }

  return (
    <CSSTransition
      timeout={200}
      classNames={{
        enter: "animate-slideInRight animate-fast",
        exit: "animate-slideOutRight animate-fast",
      }}
      nodeRef={ref}
    >
      <div
        className={clsx(
          "md:max-w-[320px] md:w-[320px] w-full",
          "fixed md:right-docs_1 left-0 md:m-docs_1",
          placement === "bottom" && "md:bottom-docs_1 bottom-0",
          placement === "top" && "md:top-docs_1 top-0",
          "opacity-100 transition-opacity duration-200 ease-ease",
          !show && "!opacity-0",
          className
        )}
        ref={ref}
        data-testid="notification-item"
      >
        {layout === "default" && (
          <NotificationItemLayoutDefault {...rest} handleClose={handleClose}>
            {children}
          </NotificationItemLayoutDefault>
        )}
        {layout === "empty" &&
          Children.map(children, (child) => {
            if (child) {
              return React.cloneElement<EmptyLayoutProps>(
                child as React.ReactElement<
                  EmptyLayoutProps,
                  React.FunctionComponent<EmptyLayoutProps>
                >,
                {
                  onClose: handleClose,
                }
              )
            }
          })}
      </div>
    </CSSTransition>
  )
}

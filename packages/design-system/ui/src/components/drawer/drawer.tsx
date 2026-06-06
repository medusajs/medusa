"use client"

import { XMark } from "@zjedene-medusa/icons"
import { Dialog as RadixDialog } from "radix-ui"
import * as React from "react"

import { IconButton } from "@/components/icon-button"
import { Kbd } from "@/components/kbd"
import { Text } from "@/components/text"
import { clx } from "@/utils/clx"

interface DrawerRootProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Root> {}

/**
 * This component is based on the [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) primitives.
 */
const DrawerRoot = (
  props: DrawerRootProps
) => {
  return <RadixDialog.Root {...props} />
}
DrawerRoot.displayName = "Drawer"

interface DrawerTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Trigger> {}

/**
 * This component is used to create the trigger button that opens the drawer.
 * It accepts props from the [Radix UI Dialog Trigger](https://www.radix-ui.com/primitives/docs/components/dialog#trigger) component.
 */
const DrawerTrigger = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Trigger>,
  DrawerTriggerProps
>(({ className, ...props }: DrawerTriggerProps, ref) => {
  return (
    <RadixDialog.Trigger ref={ref} className={clx(className)} {...props} />
  )
})
DrawerTrigger.displayName = "Drawer.Trigger"

interface DrawerCloseProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Close> {}

/**
 * This component is used to create the close button for the drawer.
 * It accepts props from the [Radix UI Dialog Close](https://www.radix-ui.com/primitives/docs/components/dialog#close) component.
 */
const DrawerClose = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Close>,
  DrawerCloseProps
>(({ className, ...props }: DrawerCloseProps, ref) => {
  return (
    <RadixDialog.Close ref={ref} className={clx(className)} {...props} />
  )
})
DrawerClose.displayName = "Drawer.Close"

interface DrawerPortalProps extends RadixDialog.DialogPortalProps {}

/**
 * The `Drawer.Content` component uses this component to wrap the drawer content.
 * It accepts props from the [Radix UI Dialog Portal](https://www.radix-ui.com/primitives/docs/components/dialog#portal) component.
 */
const DrawerPortal = (props: DrawerPortalProps) => {
  return <RadixDialog.DialogPortal {...props} />
}
DrawerPortal.displayName = "Drawer.Portal"

interface DrawerOverlayProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay> {}

/**
 * This component is used to create the overlay for the drawer.
 * It accepts props from the [Radix UI Dialog Overlay](https://www.radix-ui.com/primitives/docs/components/dialog#overlay) component.
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }: DrawerOverlayProps, ref) => {
  return (
    <RadixDialog.Overlay
      ref={ref}
      className={clx(
        "bg-ui-bg-overlay fixed inset-0",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
})
DrawerOverlay.displayName = "Drawer.Overlay"

interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  /**
   * Props for the overlay component.
   * It accepts props from the [Radix UI Dialog Overlay](https://www.radix-ui.com/primitives/docs/components/dialog#overlay) component.
  */
  overlayProps?: React.ComponentPropsWithoutRef<typeof DrawerOverlay>
  /**
   * Props for the portal component that wraps the drawer content.
   * It accepts props from the [Radix UI Dialog Portal](https://www.radix-ui.com/primitives/docs/components/dialog#portal) component.
   */
  portalProps?: React.ComponentPropsWithoutRef<typeof DrawerPortal>
}

/**
 * This component wraps the content of the drawer.
 * It accepts props from the [Radix UI Dialog Content](https://www.radix-ui.com/primitives/docs/components/dialog#content) component.
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  DrawerContentProps
>(({ className, overlayProps, portalProps, ...props }: DrawerContentProps, ref) => {
  return (
    <DrawerPortal {...portalProps}>
      <DrawerOverlay {...overlayProps} />
      <RadixDialog.Content
        ref={ref}
        className={clx(
          "bg-ui-bg-base shadow-elevation-modal border-ui-border-base fixed inset-y-2 flex w-full flex-1 flex-col rounded-lg border outline-none max-sm:inset-x-2 max-sm:w-[calc(100%-16px)] sm:right-2 sm:max-w-[560px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2 duration-200",
          className
        )}
        {...props}
      />
    </DrawerPortal>
  )
})
DrawerContent.displayName = "Drawer.Content"

interface DrawerHeaderProps extends React.ComponentPropsWithoutRef<"div"> {}

/**
 * This component is used to wrap the header content of the drawer.
 * This component is based on the `div` element and supports all of its props.
 */
const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  DrawerHeaderProps
>(({ children, className, ...props }: DrawerHeaderProps, ref) => {
  return (
    <div
      ref={ref}
      className="border-ui-border-base flex items-start justify-between gap-x-4 border-b px-6 py-4"
      {...props}
    >
      <div className={clx("flex flex-col gap-y-1", className)}>{children}</div>
      <div className="flex items-center gap-x-2">
        <Kbd>esc</Kbd>
        <RadixDialog.Close asChild>
          <IconButton size="small" type="button" variant="transparent">
            <XMark />
          </IconButton>
        </RadixDialog.Close>
      </div>
    </div>
  )
})
DrawerHeader.displayName = "Drawer.Header"

interface DrawerBodyProps extends React.ComponentPropsWithoutRef<"div"> {}

/**
 * This component is used to wrap the body content of the drawer.
 * This component is based on the `div` element and supports all of its props
 */
const DrawerBody = React.forwardRef<
  HTMLDivElement,
  DrawerBodyProps
>(({ className, ...props }: DrawerBodyProps, ref) => {
  return (
    <div ref={ref} className={clx("flex-1 px-6 py-4", className)} {...props} />
  )
})
DrawerBody.displayName = "Drawer.Body"

interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * This component is used to wrap the footer content of the drawer.
 * This component is based on the `div` element and supports all of its props.
 */
const DrawerFooter = ({
  className,
  ...props
}: DrawerFooterProps) => {
  return (
    <div
      className={clx(
        "border-ui-border-base flex items-center justify-end space-x-2 overflow-y-auto border-t px-6 py-4",
        className
      )}
      {...props}
    />
  )
}
DrawerFooter.displayName = "Drawer.Footer"

/**
 * This component adds an accessible title to the drawer.
 * It accepts props from the [Radix UI Dialog Title](https://www.radix-ui.com/primitives/docs/components/dialog#title) component.
 */
const DrawerTitle = RadixDialog.Title
DrawerTitle.displayName = "Drawer.Title"

interface DrawerDescriptionProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Description> {}

/**
 * This component adds accessible description to the drawer.
 * It accepts props from the [Radix UI Dialog Description](https://www.radix-ui.com/primitives/docs/components/dialog#description) component.
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  DrawerDescriptionProps
>(({ className, children, ...props }: DrawerDescriptionProps, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={clx(className)}
    asChild
    {...props}
  >
    <Text>{children}</Text>
  </RadixDialog.Description>
))
DrawerDescription.displayName = "Drawer.Description"

const Drawer = Object.assign(DrawerRoot, {
  Body: DrawerBody,
  Close: DrawerClose,
  Content: DrawerContent,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Header: DrawerHeader,
  Title: DrawerTitle,
  Trigger: DrawerTrigger,
})

export { Drawer }

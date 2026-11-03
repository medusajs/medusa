"use client"

import { AlertDialog as RadixAlertDialog } from "radix-ui"
import * as React from "react"

import { Button } from "@/components/button"
import { Heading } from "@/components/heading"
import { clx } from "@/utils/clx"

type PromptVariant = "danger" | "confirmation"

const PromptContext = React.createContext<{ variant: PromptVariant }>({
  variant: "danger",
})

const usePromptContext = () => {
  const context = React.useContext(PromptContext)
  if (!context) {
    throw new Error("usePromptContext must be used within a PromptProvider")
  }
  return context
}

type PromptProviderProps = React.PropsWithChildren<{
  variant: PromptVariant
}>

const PromptProvider = ({ variant, children }: PromptProviderProps) => {
  return (
    <PromptContext.Provider value={{ variant }}>
      {children}
    </PromptContext.Provider>
  )
}

/**
 * This component is based on the [Radix UI Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog) primitives.
 */
const Root = ({
  /**
   * The variant of the prompt.
   */
  variant = "danger",
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Root> & {
  variant?: PromptVariant
}) => {
  return (
    <PromptProvider variant={variant}>
      <RadixAlertDialog.Root {...props} />
    </PromptProvider>
  )
}
Root.displayName = "Prompt"

const Trigger = RadixAlertDialog.Trigger
Trigger.displayName = "Prompt.Trigger"

const Portal = (props: RadixAlertDialog.AlertDialogPortalProps) => {
  return <RadixAlertDialog.AlertDialogPortal {...props} />
}
Portal.displayName = "Prompt.Portal"

const Overlay = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <RadixAlertDialog.Overlay
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
Overlay.displayName = "Prompt.Overlay"

const Title = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Title>,
  Omit<React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Title>, "asChild">
>(({ className, children, ...props }, ref) => {
  return (
    <RadixAlertDialog.Title ref={ref} className={clx(className)} {...props} asChild>
      <Heading level="h2" className="text-ui-fg-base">
        {children}
      </Heading>
    </RadixAlertDialog.Title>
  )
})
Title.displayName = "Prompt.Title"

const Content = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Content>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Content>
>(({ className, ...props }, ref) => {
  return (
    <Portal>
      <Overlay />
      <RadixAlertDialog.Content
        ref={ref}
        className={clx(
          "bg-ui-bg-base shadow-elevation-flyout fixed inset-0 m-auto flex h-fit w-full max-w-[400px] flex-col rounded-lg border focus-visible:outline-hidden",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
          className
        )}
        {...props}
      />
    </Portal>
  )
})
Content.displayName = "Prompt.Content"

const Description = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Description>
>(({ className, ...props }, ref) => {
  return (
    <RadixAlertDialog.Description
      ref={ref}
      className={clx("text-ui-fg-subtle txt-compact-medium", className)}
      {...props}
    />
  )
})
Description.displayName = "Prompt.Description"

const Action = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Action>,
  Omit<React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Action>, "asChild">
>(({ className, children, type, ...props }, ref) => {
  const { variant } = usePromptContext()

  return (
    <RadixAlertDialog.Action ref={ref} className={className} {...props} asChild>
      <Button
        size="small"
        type={type}
        variant={variant === "danger" ? "danger" : "primary"}
      >
        {children}
      </Button>
    </RadixAlertDialog.Action>
  )
})
Action.displayName = "Prompt.Action"

const Cancel = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Cancel>,
  Omit<React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Cancel>, "asChild">
>(({ className, children, ...props }, ref) => {
  return (
    <RadixAlertDialog.Cancel ref={ref} className={clx(className)} {...props} asChild>
      <Button size="small" variant="secondary">
        {children}
      </Button>
    </RadixAlertDialog.Cancel>
  )
})
Cancel.displayName = "Prompt.Cancel"

/**
 * This component is based on the `div` element and supports all of its props
 */
const Header = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clx("flex flex-col gap-y-1 px-6 pt-6", className)}
      {...props}
    />
  )
}
Header.displayName = "Prompt.Header"

/**
 * This component is based on the `div` element and supports all of its props
 */
const Footer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clx("flex items-center justify-end gap-x-2 p-6", className)}
      {...props}
    />
  )
}
Footer.displayName = "Prompt.Footer"

const Prompt = Object.assign(Root, {
  Trigger,
  Content,
  Title,
  Description,
  Action,
  Cancel,
  Header,
  Footer,
})

export { Prompt }

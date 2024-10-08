"use client"

import * as Primitives from "@radix-ui/react-alert-dialog"
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
}: React.ComponentPropsWithoutRef<typeof Primitives.Root> & {
  variant?: PromptVariant
}) => {
  return (
    <PromptProvider variant={variant}>
      <Primitives.Root {...props} />
    </PromptProvider>
  )
}
Root.displayName = "Prompt"

const Trigger = Primitives.Trigger
Trigger.displayName = "Prompt.Trigger"

const Portal = (props: Primitives.AlertDialogPortalProps) => {
  return <Primitives.AlertDialogPortal {...props} />
}
Portal.displayName = "Prompt.Portal"

const Overlay = React.forwardRef<
  React.ElementRef<typeof Primitives.Overlay>,
  React.ComponentPropsWithoutRef<typeof Primitives.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Overlay
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
  React.ElementRef<typeof Primitives.Title>,
  Omit<React.ComponentPropsWithoutRef<typeof Primitives.Title>, "asChild">
>(({ className, children, ...props }, ref) => {
  return (
    <Primitives.Title ref={ref} className={clx(className)} {...props} asChild>
      <Heading level="h2" className="text-ui-fg-base">
        {children}
      </Heading>
    </Primitives.Title>
  )
})
Title.displayName = "Prompt.Title"

const Content = React.forwardRef<
  React.ElementRef<typeof Primitives.Content>,
  React.ComponentPropsWithoutRef<typeof Primitives.Content>
>(({ className, ...props }, ref) => {
  return (
    <Portal>
      <Overlay />
      <Primitives.Content
        ref={ref}
        className={clx(
          "bg-ui-bg-base shadow-elevation-flyout fixed left-[50%] top-[50%] flex w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] flex-col rounded-lg border focus-visible:outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] duration-200",
          className
        )}
        {...props}
      />
    </Portal>
  )
})
Content.displayName = "Prompt.Content"

const Description = React.forwardRef<
  React.ElementRef<typeof Primitives.Description>,
  React.ComponentPropsWithoutRef<typeof Primitives.Description>
>(({ className, ...props }, ref) => {
  return (
    <Primitives.Description
      ref={ref}
      className={clx("text-ui-fg-subtle txt-compact-medium", className)}
      {...props}
    />
  )
})
Description.displayName = "Prompt.Description"

const Action = React.forwardRef<
  React.ElementRef<typeof Primitives.Action>,
  Omit<React.ComponentPropsWithoutRef<typeof Primitives.Action>, "asChild">
>(({ className, children, type, ...props }, ref) => {
  const { variant } = usePromptContext()

  return (
    <Primitives.Action ref={ref} className={className} {...props} asChild>
      <Button
        size="small"
        type={type}
        variant={variant === "danger" ? "danger" : "primary"}
      >
        {children}
      </Button>
    </Primitives.Action>
  )
})
Action.displayName = "Prompt.Action"

const Cancel = React.forwardRef<
  React.ElementRef<typeof Primitives.Cancel>,
  Omit<React.ComponentPropsWithoutRef<typeof Primitives.Cancel>, "asChild">
>(({ className, children, ...props }, ref) => {
  return (
    <Primitives.Cancel ref={ref} className={clx(className)} {...props} asChild>
      <Button size="small" variant="secondary">
        {children}
      </Button>
    </Primitives.Cancel>
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

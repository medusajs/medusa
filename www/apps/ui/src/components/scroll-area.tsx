"use client"

import { clx } from "@medusajs/ui"
import * as Primitives from "@radix-ui/react-scroll-area"
import clsx from "clsx"
import { Key } from "@/types/props"

type ScrollbarProps = React.ComponentProps<typeof Primitives.Scrollbar>

const Scrollbar = ({ key, ...props }: ScrollbarProps) => {
  return (
    <Primitives.Scrollbar
      className={clsx(
        "bg-medusa-bg-baseflex touch-none select-none p-0.5 transition-colors ease-out",
        "data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      )}
      key={key as Key}
      {...props}
    />
  )
}

type ThumbProps = React.ComponentProps<typeof Primitives.Thumb>

const Thumb = ({ className, key, ...props }: ThumbProps) => {
  return (
    <Primitives.Thumb
      className={clx(
        "bg-medusa-bg-component relative flex-1 rounded-[10px] before:absolute before:left-1/2 before:top-1/2 before:h-full",
        "before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']",
        className
      )}
      key={key as Key}
      {...props}
    />
  )
}

type ScrollAreaProps = React.ComponentProps<typeof Primitives.Root>

const ScrollArea = ({ children, className }: ScrollAreaProps) => {
  return (
    <Primitives.Root
      className={clx("h-full w-full overflow-hidden", className)}
    >
      <Primitives.Viewport className="h-full w-full">
        {children}
      </Primitives.Viewport>
      <Scrollbar orientation="vertical">
        <Thumb />
      </Scrollbar>
      <Scrollbar orientation="horizontal">
        <Thumb />
      </Scrollbar>
      <Primitives.Corner />
    </Primitives.Root>
  )
}

export { ScrollArea }

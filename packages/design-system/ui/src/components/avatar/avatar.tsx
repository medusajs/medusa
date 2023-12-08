"use client"

import * as Primitives from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

const avatarVariants = cva({
  base: "border-ui-border-strong flex shrink-0 items-center justify-center overflow-hidden border",
  variants: {
    variant: {
      squared: "rounded-lg",
      rounded: "rounded-full",
    },
    size: {
      base: "h-8 w-8",
      large: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "rounded",
    size: "base",
  },
})

const innerVariants = cva({
  base: "aspect-square object-cover object-center",
  variants: {
    variant: {
      squared: "rounded-lg",
      rounded: "rounded-full",
    },
    size: {
      base: "txt-compact-small-plus h-6 w-6",
      large: "txt-compact-medium-plus h-8 w-8",
    },
  },
  defaultVariants: {
    variant: "rounded",
    size: "base",
  },
})

/**
 * @prop variant - The style of the avatar.
 * @prop size - The size of the avatar.
 */
interface AvatarProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Primitives.Root>,
      "asChild" | "children" | "size"
    >,
    VariantProps<typeof avatarVariants> {
  /**
   * The URL of the image used in the Avatar.
   */
  src?: string
  /**
   * Text to show in the avatar if the URL provided in `src` can't be opened.
   */
  fallback: string
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof Primitives.Root>,
  AvatarProps
>(
  (
    { src, fallback, variant = "rounded", size = "base", className, ...props }: AvatarProps,
    ref
  ) => {
    return (
      <Primitives.Root
        ref={ref}
        {...props}
        className={clx(avatarVariants({ variant, size }), className)}
      >
        {src && (
          <Primitives.Image
            src={src}
            className={innerVariants({ variant, size })}
          />
        )}
        <Primitives.Fallback
          className={clx(
            innerVariants({ variant, size }),
            "bg-ui-bg-component text-ui-fg-subtle pointer-events-none flex select-none items-center justify-center"
          )}
        >
          {fallback}
        </Primitives.Fallback>
      </Primitives.Root>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }

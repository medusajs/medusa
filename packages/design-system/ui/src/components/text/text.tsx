import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

const textVariants = cva({
  variants: {
    size: {
      xsmall: "",
      small: "",
      base: "",
      large: "",
      xlarge: "",
    },
    weight: {
      regular: "font-normal",
      plus: "font-medium",
    },
    family: {
      sans: "font-sans",
      mono: "font-mono",
    },
    leading: {
      normal: "",
      compact: "",
    },
  },
  defaultVariants: {
    family: "sans",
    size: "base",
    weight: "regular",
    leading: "normal",
  },
  compoundVariants: [
    {
      size: "xsmall",
      leading: "normal",
      className: "txt-xsmall",
    },
    {
      size: "xsmall",
      leading: "compact",
      className: "txt-compact-xsmall",
    },
    {
      size: "small",
      leading: "normal",
      className: "txt-small",
    },
    {
      size: "small",
      leading: "compact",
      className: "txt-compact-small",
    },
    {
      size: "base",
      leading: "normal",
      className: "txt-medium",
    },
    {
      size: "base",
      leading: "compact",
      className: "txt-compact-medium",
    },
    {
      size: "large",
      leading: "normal",
      className: "txt-large",
    },
    {
      size: "large",
      leading: "compact",
      className: "txt-compact-large",
    },
    {
      size: "xlarge",
      leading: "normal",
      className: "txt-xlarge",
    },
    {
      size: "xlarge",
      leading: "compact",
      className: "txt-compact-xlarge",
    },
  ],
})

interface TextProps
  extends React.ComponentPropsWithoutRef<"p">,
    VariantProps<typeof textVariants> {
  asChild?: boolean
  as?: "p" | "span" | "div"
}

/**
 * This component is based on the `p` element and supports all of its props
 */
const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      className,
      /**
       * Whether to remove the wrapper `button` element and use the
       * passed child element instead.
       */
      asChild = false,
      /**
       * The wrapper element to use when `asChild` is disabled.
       */
      as = "p",
      /**
       * The text's size.
       */
      size = "base",
      /**
       * The text's font weight.
       */
      weight = "regular",
      /**
       * The text's font family.
       */
      family = "sans",
      /**
       * The text's line height.
       */
      leading = "normal",
      children,
      ...props
    }: TextProps,
    ref
  ) => {
    const Component = asChild ? Slot : as

    return (
      <Component
        ref={ref}
        className={clx(
          textVariants({ size, weight, family, leading }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Text.displayName = "Text"

export { Text }

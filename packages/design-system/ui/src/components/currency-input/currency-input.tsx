"use client"

import * as React from "react"
import Primitive from "react-currency-input-field"

import { Text } from "@/components/text"
import { clx } from "@/utils/clx"
import { VariantProps, cva } from "cva"

const currencyInputVariants = cva({
  base: clx(
    "flex items-center gap-x-1",
    "bg-ui-bg-field hover:bg-ui-bg-field-hover shadow-buttons-neutral placeholder-ui-fg-muted text-ui-fg-base transition-fg relative w-full rounded-md",
    "focus-within:shadow-borders-interactive-with-active"
  ),
  variants: {
    size: {
      base: "txt-compact-medium h-8",
      small: "txt-compact-small h-7",
    },
  },
  defaultVariants: {
    size: "base",
  },
})

interface CurrencyInputProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Primitive>,
      "prefix" | "suffix" | "size"
    >,
    VariantProps<typeof currencyInputVariants> {
  symbol: string
  code: string
}

/**
 * This component is based on the input element and supports all of its props
 *
 * @excludeExternal
 */
const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      /**
       * The input's size.
       */
      size = "base",
      /**
       * The symbol to show in the input.
       */
      symbol,
      /**
       * The currency code to show in the input.
       */
      code,
      disabled,
      onInvalid,
      className,
      ...props
    }: CurrencyInputProps,
    ref
  ) => {
    const innerRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current
    )

    const [valid, setValid] = React.useState(true)

    const onInnerInvalid = React.useCallback(
      (event: React.FormEvent<HTMLInputElement>) => {
        setValid(event.currentTarget.validity.valid)

        if (onInvalid) {
          onInvalid(event)
        }
      },
      [onInvalid]
    )

    return (
      <div
        onClick={() => {
          if (innerRef.current) {
            innerRef.current.focus()
          }
        }}
        className={clx(
          "w-full cursor-text justify-between overflow-hidden",
          currencyInputVariants({ size }),
          {
            "text-ui-fg-disabled !bg-ui-bg-disabled !shadow-buttons-neutral !placeholder-ui-fg-disabled cursor-not-allowed":
              disabled,
            "!shadow-borders-error invalid:!shadow-borders-error":
              props["aria-invalid"] || !valid,
          },
          className
        )}
      >
        <span
          className={clx("w-fit min-w-[32px] border-r px-2", {
            "py-[9px]": size === "base",
            "py-[5px]": size === "small",
          })}
          role="presentation"
        >
          <Text
            size="small"
            leading="compact"
            className={clx(
              "text-ui-fg-muted pointer-events-none select-none uppercase",
              {
                "text-ui-fg-disabled": disabled,
              }
            )}
          >
            {code}
          </Text>
        </span>
        <Primitive
          className="h-full min-w-0 flex-1 appearance-none bg-transparent text-right outline-none disabled:cursor-not-allowed"
          disabled={disabled}
          onInvalid={onInnerInvalid}
          ref={innerRef}
          {...props}
        />
        <span
          className={clx(
            "flex w-fit min-w-[32px] items-center justify-center border-l px-2 text-right",
            {
              "py-[9px]": size === "base",
              "py-[5px]": size === "small",
            }
          )}
          role="presentation"
        >
          <Text
            size="small"
            leading="compact"
            className={clx("text-ui-fg-muted pointer-events-none select-none", {
              "text-ui-fg-disabled": disabled,
            })}
          >
            {symbol}
          </Text>
        </span>
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }

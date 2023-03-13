import clsx from "clsx"
import React, { useImperativeHandle, useRef } from "react"
import InputError from "../../atoms/input-error"
import InputHeader from "../../fundamentals/input-header"
import EmojiPicker from "../emoji-picker"

type TextareaProps = React.ComponentPropsWithRef<"textarea"> & {
  errors?: { [x: string]: unknown }
  label: string
  key?: string
  enableEmoji?: boolean
  withTooltip?: boolean
  tooltipText?: string
  tooltipProps?: any
  children?: React.ReactNode
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      placeholder,
      label,
      name,
      key,
      required,
      withTooltip = false,
      tooltipText,
      tooltipProps = {},
      containerProps,
      className,
      enableEmoji = false,
      rows = 2,
      children,
      errors,
      ...props
    }: TextareaProps,
    ref
  ) => {
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => inputRef.current
    )

    const scrollToTop = () => {
      if (inputRef.current) {
        inputRef.current.scrollTop = 0
      }
    }

    const handleAddEmoji = (emoji: string) => {
      if (!inputRef.current) {
        return
      }

      const position = inputRef.current.selectionStart || 0

      const newValue = `${inputRef.current?.value.substring(
        0,
        position
      )}${emoji}${inputRef.current?.value.substring(position)}`

      inputRef.current.value = newValue
    }

    return (
      <div className={className} {...containerProps}>
        {label && (
          <InputHeader
            {...{ label, required, withTooltip, tooltipText, tooltipProps }}
            className="mb-xsmall"
          />
        )}
        <div
          className={clsx(
            "focus-within:shadow-input focus-within:border-violet-60 px-small py-xsmall bg-grey-5 border-grey-20 rounded-rounded flex w-full flex-col border",
            {
              "focus-within:shadow-cta focus-within:shadow-rose-60/10 border-rose-50 focus-within:border-rose-50":
                errors && name && errors[name],
            }
          )}
        >
          <textarea
            className={clsx(
              "relative resize-none overflow-hidden bg-inherit text-justify outline-none outline-0 focus:overflow-auto",
              "remove-number-spinner leading-base text-grey-90 caret-violet-60 placeholder-grey-40 w-full font-normal",
              "line-clamp-[var(--lines)] focus:line-clamp-none"
            )}
            style={
              {
                "--lines": rows,
              } as React.CSSProperties
            }
            ref={inputRef}
            autoComplete="off"
            name={name}
            key={key || name}
            placeholder={placeholder || "Placeholder"}
            onBlur={scrollToTop}
            onSelect={(e) => {}}
            rows={rows}
            {...props}
          />
          {enableEmoji && <EmojiPicker onEmojiClick={handleAddEmoji} />}
        </div>
        <InputError name={name} errors={errors} />
      </div>
    )
  }
)

export default TextArea

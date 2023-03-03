import clsx from "clsx"
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  useImperativeHandle,
  useRef,
} from "react"
import InputError from "../../atoms/input-error"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import InputHeader, { InputHeaderProps } from "../../fundamentals/input-header"

export type InputProps = Omit<React.ComponentPropsWithRef<"input">, "prefix"> &
  InputHeaderProps & {
    small?: boolean
    label?: string
    deletable?: boolean
    onDelete?: MouseEventHandler<HTMLSpanElement>
    onChange?: ChangeEventHandler<HTMLInputElement>
    onFocus?: FocusEventHandler<HTMLInputElement>
    errors?: { [x: string]: unknown }
    prefix?: React.ReactNode
    props?: React.HTMLAttributes<HTMLDivElement>
  }

const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      small,
      placeholder,
      label,
      name,
      required,
      deletable,
      onDelete,
      onChange,
      onFocus,
      tooltipContent,
      tooltip,
      prefix,
      errors,
      props,
      className,
      ...fieldProps
    }: InputProps,
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current
    )

    const onNumberIncrement = () => {
      inputRef.current?.stepUp()
      if (onChange) {
        inputRef.current?.dispatchEvent(
          new InputEvent("change", {
            view: window,
            bubbles: true,
            cancelable: false,
          })
        )
      }
    }

    const onNumberDecrement = () => {
      inputRef.current?.stepDown()
      if (onChange) {
        inputRef.current?.dispatchEvent(
          new InputEvent("change", {
            view: window,
            bubbles: true,
            cancelable: false,
          })
        )
      }
    }

    return (
      <div className={clsx("w-full", className)} {...props}>
        {label && (
          <InputHeader
            {...{ label, required, tooltipContent, tooltip }}
            className="mb-xsmall"
          />
        )}
        <div
          className={clsx(
            "w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60",
            {
              "border-rose-50 focus-within:shadow-cta focus-within:shadow-rose-60/10 focus-within:border-rose-50":
                errors && name && errors[name],
            },
            small ? "h-8" : "h-10"
          )}
        >
          {prefix ? (
            <span className="text-grey-40 mr-2xsmall">{prefix}</span>
          ) : null}
          <input
            className={clsx(
              "bg-transparent outline-none outline-0 w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40",
              { "text-small": small, "pt-[1px]": small }
            )}
            ref={inputRef}
            autoComplete="off"
            name={name}
            placeholder={placeholder || `${label}...` || "Placeholder"}
            onChange={onChange}
            onFocus={onFocus}
            required={required}
            {...fieldProps}
          />

          {deletable && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center w-4 h-4 pb-px ml-2 outline-none cursor-pointer text-grey-50 hover:bg-grey-10 focus:bg-grey-20 rounded-soft"
              type="button"
            >
              &times;
            </button>
          )}

          {fieldProps.type === "number" && (
            <div className="flex items-center self-end h-full">
              <button
                onClick={onNumberDecrement}
                onMouseDown={(e) => e.preventDefault()}
                className="w-4 h-4 mr-2 outline-none cursor-pointer text-grey-50 hover:bg-grey-10 focus:bg-grey-20 rounded-soft"
                type="button"
              >
                <MinusIcon size={16} />
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={onNumberIncrement}
                className="w-4 h-4 outline-none cursor-pointer text-grey-50 hover:bg-grey-10 focus:bg-grey-20 rounded-soft"
                type="button"
              >
                <PlusIcon size={16} />
              </button>
            </div>
          )}
        </div>
        <InputError name={name} errors={errors} />
      </div>
    )
  }
)

export default InputField

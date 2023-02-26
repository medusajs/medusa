import clsx from "clsx"
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { EyeIcon, EyeOffIcon, LockIcon } from "../../icons"
import { InputError } from "../input-error"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  onChange?: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  props?: React.HTMLAttributes<HTMLDivElement>
  errors?: { [x: string]: unknown }
}

export const SigninInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      placeholder,
      name,
      required,
      onChange,
      onFocus,
      className,
      type,
      errors,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current
    )

    return (
      <div>
        <div
          className={clsx(
            "rounded-rounded h-[48px] w-[320px] overflow-hidden border",
            "bg-grey-5 inter-base-regular placeholder:text-grey-40",
            "focus-within:shadow-input focus-within:border-violet-60",
            "flex items-center",
            {
              "text-grey-40 pointer-events-none focus-within:border-none focus-within:shadow-none":
                props.readOnly,
            },
            className
          )}
        >
          {props.readOnly && (
            <LockIcon size={16} className="text-grey-40 ml-base" />
          )}
          <input
            className={clsx(
              "remove-number-spinner leading-base w-full bg-transparent py-3 px-4 outline-none outline-0",
              {
                "pl-xsmall": props.readOnly,
              }
            )}
            ref={inputRef}
            name={name}
            placeholder={placeholder || "Placeholder"}
            onChange={onChange}
            onFocus={onFocus}
            type={inputType}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-grey-40 focus:text-violet-60 px-4 focus:outline-none"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          )}
        </div>
        <InputError errors={errors} name={name} />
      </div>
    )
  }
)

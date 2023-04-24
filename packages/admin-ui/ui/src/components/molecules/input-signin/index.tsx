import clsx from "clsx"
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import EyeIcon from "../../fundamentals/icons/eye-icon"
import EyeOffIcon from "../../fundamentals/icons/eye-off-icon"
import LockIcon from "../../fundamentals/icons/lock-icon"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  key?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  props?: React.HTMLAttributes<HTMLDivElement>
}

const SigninInput = React.forwardRef(
  (
    {
      placeholder,
      name,
      key,
      required,
      onChange,
      onFocus,
      className,
      type,
      ...props
    }: InputProps,
    ref
  ) => {
    const inputRef = useRef(null)
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

    useImperativeHandle(ref, () => inputRef.current)

    return (
      <div
        className={clsx(
          "w-[320px] h-[48px] mb-xsmall last:mb-0 border rounded-rounded overflow-hidden",
          "bg-grey-5 inter-base-regular placeholder:text-grey-40",
          "focus-within:shadow-input focus-within:border-violet-60",
          "flex items-center",
          {
            "pointer-events-none focus-within:shadow-none focus-within:border-none text-grey-40":
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
            "outline-none outline-0 remove-number-spinner leading-base bg-transparent w-full py-3 px-4",
            {
              "pl-xsmall": props.readOnly,
            }
          )}
          ref={inputRef}
          name={name}
          key={key || name}
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
            className="text-grey-40 px-4 focus:outline-none focus:text-violet-60"
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>
    )
  }
)

export default SigninInput

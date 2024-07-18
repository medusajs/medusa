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
          "rounded-rounded h-[40px] w-[300px] overflow-hidden border",
          "bg-grey-5 inter-base-regular placeholder:text-grey-40",
          "focus-within:shadow-input focus-within:border-violet-60",
          "flex items-center",
          {
            "text-grey-40 ps-xsmall pointer-events-none focus-within:border-none focus-within:shadow-none":
              props.readOnly,
          },
          className
        )}
      >
        <input
          className={clsx(
            "remove-number-spinner leading-base w-full bg-transparent px-4 py-3 outline-none outline-0",
            {
              "ps-xsmall": props.readOnly,
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
            className="text-grey-40 focus:text-violet-60 px-4 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
          </button>
        )}
        {props.readOnly && (
          <LockIcon size={16} className="text-grey-40 me-base" />
        )}
      </div>
    )
  }
)

SigninInput.displayName = "SigninInput"

export default SigninInput

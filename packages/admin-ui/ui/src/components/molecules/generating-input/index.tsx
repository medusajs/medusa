import React, {
  InputHTMLAttributes,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { generatePromotionCode } from "../../../utils/generate-promotion-code"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import { InputProps } from "../input"

const GeneratingInput = React.forwardRef(
  (
    {
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
      props,
      className,
      value: valueProp,
      ...fieldProps
    }: Omit<InputProps, "prefix" | "key">,
    ref
  ) => {
    const [value, setValue] = useState<
      InputHTMLAttributes<HTMLInputElement>["value"]
    >(valueProp || "")
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => inputRef.current)

    const generateCode = () => {
      setValue(generatePromotionCode())
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <InputContainer
        className={className}
        key={name}
        onClick={() => !fieldProps.disabled && inputRef?.current?.focus()}
        {...props}
      >
        <div className="flex">
          <InputHeader {...{ label, required, tooltipContent, tooltip }} />
          {!value && (
            <button
              onClick={generateCode}
              className="inter-small-semibold text-violet-50"
            >
              Generate
            </button>
          )}
        </div>
        <div className="flex">
          <input
            ref={inputRef}
            value={value}
            onChange={handleChange}
            className="remove-number-spinner leading-base text-grey-90 caret-violet-60 placeholder-grey-40 w-full bg-inherit font-normal outline-none outline-0"
            placeholder={placeholder}
            autoComplete="off"
            name={name}
            onFocus={onFocus}
            required={required}
            {...fieldProps}
          />
          {value && (
            <button onClick={generateCode}>
              <RefreshIcon size={16} className="text-grey-50" />
            </button>
          )}
        </div>
      </InputContainer>
    )
  }
)

export default GeneratingInput

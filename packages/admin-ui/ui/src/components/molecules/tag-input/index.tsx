import clsx from "clsx"
import React, { useRef, useState } from "react"
import Tooltip from "../../atoms/tooltip"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import InputHeader from "../../fundamentals/input-header"

const ENTER_KEY = 13
const TAB_KEY = 9
const BACKSPACE_KEY = 8
const ARROW_LEFT_KEY = 37
const ARROW_RIGHT_KEY = 39

type TagInputProps = {
  onChange: (values: string[]) => void
  onValidate?: (value: string) => void
  label?: string
  showLabel?: boolean
  values: string[]
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  withTooltip?: boolean
  tooltipContent?: string
  tooltip?: React.ReactNode
  invalidMessage?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const TagInput: React.FC<TagInputProps> = ({
  onChange,
  onValidate,
  values = [],
  label,
  showLabel = true,
  containerProps,
  className,
  required,
  placeholder,
  withTooltip = false,
  tooltipContent,
  tooltip,
  invalidMessage = "is not a valid tag",
  ...props
}) => {
  const [invalid, setInvalid] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddValue = (newVal) => {
    let update = newVal

    if (typeof onValidate !== "undefined") {
      update = onValidate(newVal)
    }

    if (update) {
      onChange([...values, update])
      if (inputRef?.current) {
        inputRef.current.value = ""
      }
    } else {
      setInvalid(true)
    }
  }

  const handleKeyDown = (e) => {
    if (invalid) {
      setInvalid(false)
    }

    if (!inputRef?.current) {
      return
    }

    const { value, selectionStart } = inputRef.current

    switch (e.keyCode) {
      case ARROW_LEFT_KEY:
        if (highlighted !== -1) {
          // highlight previous element
          if (highlighted > 0) {
            setHighlighted(highlighted - 1)
          }
        } else if (!selectionStart) {
          // else highlight last element
          setHighlighted(values.length - 1)
          e.preventDefault()
        }
        break
      case ARROW_RIGHT_KEY:
        if (highlighted !== -1) {
          // highlight next element
          if (highlighted < values.length - 1) {
            setHighlighted(highlighted + 1)
            e.preventDefault()
          } else {
            // else remove highlighting entirely
            setHighlighted(-1)
          }
        }
        break
      case ENTER_KEY: // Fall through
        e.preventDefault()
        break
      case TAB_KEY: // Creates new tag
        if (value) {
          handleAddValue(value)
          e.preventDefault()
        }
        break

      case BACKSPACE_KEY: // Removes tag
        // if no element is currently highlighted, highlight last element
        if (!inputRef.current.selectionStart && highlighted === -1) {
          setHighlighted(values.length - 1)
          e.preventDefault()
        }
        // if element is highlighted, remove it
        if (highlighted !== -1) {
          const newValues = [...values]
          newValues.splice(highlighted, 1)
          onChange(newValues)
          setHighlighted(-1)
        }
        break
      default:
        // Remove highlight from any tag
        setHighlighted(-1)
    }
  }

  const handleRemove = (index) => {
    const newValues = [...values]
    newValues.splice(index, 1)
    onChange(newValues)
  }

  const handleBlur = (e) => {
    const value = inputRef?.current?.value
    setHighlighted(-1)

    if (value) {
      handleAddValue(value)
    }
  }

  const handleInput = () => {
    if (!inputRef?.current) {
      return
    }

    const value = inputRef.current.value

    if (value?.endsWith(",")) {
      inputRef.current.value = value.slice(0, -1)
      handleAddValue(value.slice(0, -1))
    }
  }

  return (
    <div className={className}>
      {showLabel && (
        <InputHeader
          label={label || "Tags (comma separated)"}
          {...{ required, tooltipContent, tooltip }}
          className="mb-2"
        />
      )}

      <Tooltip
        open={invalid}
        side={"top"}
        content={
          <p className="text-rose-50">
            {inputRef?.current?.value} {invalidMessage}
          </p>
        }
      >
        <div
          className={clsx(
            "h-auto min-h-[40px] bg-grey-5 shadow-border focus-within:outline-4 focus-within:outline focus-within:outline-violet-60/10 transition-colors focus-within:shadow-focus-border rounded-rounded flex items-center px-3 box-border",
            {
              "shadow-error-border focus-within:shadow-error-border focus-within:outline-rose-60/10": invalid,
            }
          )}
        >
          <div className="h-full">
            <div className="w-full gap-xsmall flex flex-wrap box-border h-28px py-1.5">
              {values.map((v, index) => (
                <div
                  key={index}
                  className={clsx(
                    "flex items-center justify-center whitespace-nowrap w-max bg-grey-20 rounded-rounded px-3 py-1 gap-x-1",
                    {
                      ["!bg-grey-90"]: index === highlighted,
                    }
                  )}
                >
                  <span
                    className={clsx(
                      "inline-block text-grey-50 inter-small-semibold",
                      {
                        ["text-grey-20"]: index === highlighted,
                      }
                    )}
                  >
                    {v}
                  </span>
                  <CrossIcon
                    className="inline cursor-pointer text-grey-40"
                    size="16"
                    onClick={() => handleRemove(index)}
                  />
                </div>
              ))}
              <input
                id="tag-input"
                ref={inputRef}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onChange={handleInput}
                className={clsx("focus:outline-none bg-transparent flex-1")}
                placeholder={values?.length ? "" : placeholder} // only visible if no tags exist
                {...props}
              />
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
  )
}

export default TagInput

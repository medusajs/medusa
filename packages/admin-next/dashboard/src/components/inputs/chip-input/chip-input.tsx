import { Badge, clx } from "@medusajs/ui"
import {
  KeyboardEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

type ChipInputProps = {
  value?: string[]
  onChange?: (value: string[]) => void
  onBlur?: () => void
  name?: string
  disabled?: boolean
  allowDuplicates?: boolean
  variant?: "base" | "contrast"
  className?: string
}

export const ChipInput = forwardRef<HTMLInputElement, ChipInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      disabled,
      name,
      variant = "base",
      allowDuplicates = false,
      className,
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null)

    const isControlledRef = useRef(typeof value !== "undefined")
    const isControlled = isControlledRef.current

    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>([])

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current
    )

    const chips = isControlled ? (value as string[]) : uncontrolledValue

    const handleAddChip = (chip: string) => {
      if (!allowDuplicates && chips.includes(chip)) {
        return
      }

      onChange?.([...chips, chip])

      if (!isControlled) {
        setUncontrolledValue([...chips, chip])
      }
    }

    const handleRemoveChip = (chip: string) => {
      onChange?.(chips.filter((v) => v !== chip))

      if (!isControlled) {
        setUncontrolledValue(chips.filter((v) => v !== chip))
      }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()

        if (!innerRef.current?.value) {
          return
        }

        handleAddChip(innerRef.current?.value ?? "")
        innerRef.current.value = ""
        innerRef.current?.focus()
      }

      if (e.key === "Backspace" && innerRef.current?.value === "") {
        handleRemoveChip(chips[chips.length - 1])
      }
    }

    return (
      <div
        className={clx(
          "shadow-borders-base flex min-h-8 flex-wrap items-center gap-1 rounded-md px-2 py-1.5",
          "transition-fg focus-within:shadow-borders-interactive-with-active",
          "has-[input:disabled]:bg-ui-bg-disabled has-[input:disabled]:text-ui-fg-disabled has-[input:disabled]:cursor-not-allowed",
          {
            "bg-ui-bg-base hover:bg-ui-bg-base-hover": variant === "contrast",
            "bg-ui-bg-field hover:bg-ui-bg-field-hover": variant === "base",
          },
          className
        )}
      >
        {chips.map((v) => {
          return (
            <Badge key={`${v}-${crypto.randomUUID()}`} size="2xsmall">
              {v}
            </Badge>
          )
        })}
        <input
          className={clx(
            "caret-ui-fg-base text-ui-fg-base txt-compact-small flex-1 appearance-none bg-transparent",
            "disabled:text-ui-fg-disabled disabled:cursor-not-allowed",
            "focus:outline-none",
            "placeholder:text-ui-fg-muted"
          )}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          name={name}
          onBlur={onBlur}
          ref={innerRef}
        />
      </div>
    )
  }
)

ChipInput.displayName = "ChipInput"

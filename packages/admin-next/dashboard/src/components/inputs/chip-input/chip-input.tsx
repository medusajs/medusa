import { XMarkMini } from "@medusajs/icons"
import { Badge, clx } from "@medusajs/ui"
import { AnimatePresence, motion } from "framer-motion"
import {
  FocusEvent,
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
  showRemove?: boolean
  variant?: "base" | "contrast"
  className?: string
  placeholder?: string
}

export const ChipInput = forwardRef<HTMLInputElement, ChipInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      disabled,
      name,
      showRemove = true,
      variant = "base",
      allowDuplicates = false,
      placeholder = "",
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

    const [duplicateIndex, setDuplicateIndex] = useState<number | null>(null)

    const chips = isControlled ? (value as string[]) : uncontrolledValue

    const handleAddChip = (chip: string) => {
      const cleanValue = chip.trim()

      if (!cleanValue) {
        return
      }

      if (!allowDuplicates && chips.includes(cleanValue)) {
        setDuplicateIndex(chips.indexOf(cleanValue))

        setTimeout(() => {
          setDuplicateIndex(null)
        }, 300)

        return
      }

      onChange?.([...chips, cleanValue])

      if (!isControlled) {
        setUncontrolledValue([...chips, cleanValue])
      }
    }

    const handleRemoveChip = (chip: string) => {
      onChange?.(chips.filter((v) => v !== chip))

      if (!isControlled) {
        setUncontrolledValue(chips.filter((v) => v !== chip))
      }
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      onBlur?.()

      if (e.target.value) {
        handleAddChip(e.target.value)
        e.target.value = ""
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

    // create a shake animation using framer motion
    const shake = {
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.3 },
    }

    return (
      <div
        className={clx(
          "shadow-borders-base flex min-h-8 flex-wrap items-center gap-1 rounded-md px-2 py-1.5",
          "transition-fg focus-within:shadow-borders-interactive-with-active",
          "has-[input:disabled]:bg-ui-bg-disabled has-[input:disabled]:text-ui-fg-disabled has-[input:disabled]:cursor-not-allowed",
          {
            "bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover":
              variant === "contrast",
            "bg-ui-bg-field hover:bg-ui-bg-field-hover": variant === "base",
          },
          className
        )}
        tabIndex={-1}
        onClick={() => innerRef.current?.focus()}
      >
        {chips.map((v, index) => {
          return (
            <AnimatePresence key={`${v}-${index}`}>
              <Badge
                size="2xsmall"
                className={clx("gap-x-0.5 pl-1.5 pr-1.5", {
                  "transition-fg pr-1": showRemove,
                  "shadow-borders-focus": index === duplicateIndex,
                })}
                asChild
              >
                <motion.div
                  animate={index === duplicateIndex ? shake : undefined}
                >
                  {v}
                  {showRemove && (
                    <button
                      tabIndex={-1}
                      type="button"
                      onClick={() => handleRemoveChip(v)}
                      className={clx(
                        "text-ui-fg-subtle transition-fg outline-none"
                      )}
                    >
                      <XMarkMini />
                    </button>
                  )}
                </motion.div>
              </Badge>
            </AnimatePresence>
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
          onBlur={handleBlur}
          disabled={disabled}
          name={name}
          ref={innerRef}
          placeholder={!chips?.length ? placeholder : ""}
        />
      </div>
    )
  }
)

ChipInput.displayName = "ChipInput"

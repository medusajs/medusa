import { XMarkMini } from "@medusajs/icons"
import { Badge, IconButton, clx } from "@medusajs/ui"
import { KeyboardEvent, forwardRef, useImperativeHandle, useRef } from "react"
import { NEW_TAG_PREFIX } from "../../constants"

type Tag = {
  value: string
  id: string
}
type TagInputProps = {
  value: Tag[]
  onChange: (tags: Tag[]) => void
  onBlur?: () => void
  disabled?: boolean
  name?: string
  className?: string
}

const CREATE_KEYS = ["Enter", "Tab", ",", " "]

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, onChange, onBlur, disabled, name, className }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

    const createId = (value: string) => {
      return `${NEW_TAG_PREFIX}_${crypto.randomUUID()}_${value}`
    }

    const createTag = () => {
      const tag = innerRef.current?.value

      if (!tag) {
        return null
      }

      innerRef.current.value = ""

      return {
        value: tag.trim(),
        id: createId(tag),
      }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (CREATE_KEYS.includes(e.key)) {
        e.preventDefault()

        const newTag = createTag()

        if (newTag) {
          onChange([...value, newTag])
          innerRef
        }
      }

      if (e.key === "Backspace" && innerRef.current?.value === "") {
        onChange(value.slice(0, -1))
      }
    }

    const handleDelete = (tag: Tag) => {
      onChange(value.filter((t) => t.id !== tag.id))

      if (innerRef.current) {
        innerRef.current.focus()
      }
    }

    return (
      <div
        tabIndex={-1}
        onClick={() => innerRef.current?.focus()}
        className={clx(
          "relative flex cursor-pointer flex-wrap items-center gap-1 overflow-hidden",
          "min-h-8 w-full rounded-md px-2 py-1",
          "bg-ui-bg-field transition-fg shadow-borders-base",
          "hover:bg-ui-bg-field-hover",
          "has-[input:focus]:shadow-borders-interactive-with-active",
          "has-[:invalid]:shadow-borders-error has-[[aria-invalid=true]]:shadow-borders-error",
          "has-[:disabled]:bg-ui-bg-disabled has-[:disabled]:text-ui-fg-disabled has-[:disabled]:cursor-not-allowed",
          className
        )}
      >
        {value.map((tag) => {
          return (
            <Badge
              size="2xsmall"
              key={tag.id}
              className="bg-ui-bg-base flex items-center gap-x-0 px-0 py-0"
            >
              <span className="border-r px-2">{tag.value}</span>
              <IconButton
                size="2xsmall"
                variant="transparent"
                type="button"
                className="focus-visible:shadow-borders-focus bg-ui-bg-base hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed h-[18px] rounded-l-none rounded-r-[4px]"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()

                  handleDelete(tag)
                }}
              >
                <XMarkMini />
              </IconButton>
            </Badge>
          )
        })}
        <input
          className="txt-compact-small flex-1 bg-transparent outline-none"
          ref={innerRef}
          disabled={disabled}
          onBlur={onBlur}
          name={name}
          onKeyDown={handleKeyDown}
        />
      </div>
    )
  }
)

TagInput.displayName = "TagInput"

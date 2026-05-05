import { useRef, useState, useEffect } from "react"
import { IconButton } from "@medusajs/ui"
import { Plus, XMark } from "@medusajs/icons"
import { useCombinedRefs } from "../../../hooks/use-combined-refs"
import { Form } from "../../../components/common/form"
import { TieredPriceInputProps } from "./types"

export const TieredPriceInput = ({
  field,
  label,
  toggleValues,
  renderInput,
}: TieredPriceInputProps) => {
  const innerRef = useRef<HTMLInputElement>(null)
  const [isActive, setIsActive] = useState(false)

  const { value, onChange, ref } = field

  const refs = useCombinedRefs(innerRef, ref)

  useEffect(() => {
    setIsActive(value !== toggleValues.inactive)
  }, [value, toggleValues.inactive])

  const action = () => {
    if (!isActive) {
      onChange(toggleValues.active)
      setIsActive(true)
      requestAnimationFrame(() => {
        innerRef.current?.focus()
      })
    } else {
      onChange(toggleValues.inactive)
      setIsActive(false)
    }
  }

  return (
    <Form.Item>
      <div className="grid grid-cols-2 items-start gap-x-2 p-3">
        <div className="flex h-8 items-center gap-x-1">
          <IconButton size="2xsmall" variant="transparent" onClick={action}>
            {!isActive ? <Plus /> : <XMark />}
          </IconButton>
          <Form.Label>{label}</Form.Label>
        </div>
        {isActive && (
          <div className="flex flex-col gap-y-1">
            <Form.Control>
              {renderInput({ field: { ...field, ref: refs }, value })}
            </Form.Control>
            <Form.ErrorMessage />
          </div>
        )}
      </div>
    </Form.Item>
  )
}

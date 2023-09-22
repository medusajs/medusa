import { Input } from "@medusajs/ui"

export default function InputSmall() {
  return (
    <div className="w-[250px]">
      <Input placeholder="First name" id="first-name" size="small" />
    </div>
  )
}

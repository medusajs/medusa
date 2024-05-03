import { Input } from "@medusajs/ui"

export default function InputError() {
  return (
    <div className="w-[250px]">
      <Input
        placeholder="Sales Channel Name"
        id="sales-channel-name"
        aria-invalid={true}
      />
    </div>
  )
}

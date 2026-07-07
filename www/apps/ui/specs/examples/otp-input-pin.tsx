import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputPin() {
  const [pin, setPin] = useState("")
  return (
    <div className="w-[250px]">
      <OtpInput value={pin} onChange={setPin} length={4} groupSize={4} />
    </div>
  )
}

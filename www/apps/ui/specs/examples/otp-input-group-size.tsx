import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputGroupSize() {
  const [otp, setOtp] = useState("")
  return (
    <div className="w-[250px]">
      <OtpInput value={otp} onChange={setOtp} groupSize={2} />
    </div>
  )
}

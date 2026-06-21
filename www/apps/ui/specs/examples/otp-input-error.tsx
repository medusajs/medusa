import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputError() {
  const [otp, setOtp] = useState("123")
  return (
    <div className="w-[250px]">
      <OtpInput value={otp} onChange={setOtp} aria-invalid={true} />
    </div>
  )
}

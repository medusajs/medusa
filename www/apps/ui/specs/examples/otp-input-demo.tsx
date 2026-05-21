import { OtpInput } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputDemo() {
  const [otp, setOtp] = useState("")
  return (
    <div className="w-[250px]">
      <OtpInput value={otp} onChange={setOtp} />
    </div>
  )
}

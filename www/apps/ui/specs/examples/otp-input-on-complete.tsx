import { OtpInput, Text } from "@medusajs/ui"
import { useState } from "react"

export default function OtpInputOnComplete() {
  const [otp, setOtp] = useState("")
  const [submitted, setSubmitted] = useState<string | null>(null)

  return (
    <div className="flex w-[250px] flex-col items-center gap-y-3">
      <OtpInput
        value={otp}
        onChange={(value) => {
          setOtp(value)
          if (submitted) {
            setSubmitted(null)
          }
        }}
        onComplete={(value) => setSubmitted(value)}
      />
      {submitted && <Text size="small">Submitted code: {submitted}</Text>}
    </div>
  )
}

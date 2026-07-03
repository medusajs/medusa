import { Text } from "@medusajs/ui"
import QRCode from "qrcode"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

type MfaQrCodeProps = {
  value: string
}

export const MfaQrCode = ({ value }: MfaQrCodeProps) => {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    setError(false)

    QRCode.toCanvas(canvas, value, {
      margin: 2,
      width: 220,
      errorCorrectionLevel: "M",
    }).catch(() => {
      setError(true)
    })
  }, [value])

  if (error) {
    return (
      <div className="border-ui-border-base bg-ui-bg-subtle flex size-[220px] items-center justify-center rounded-md border">
        <Text size="small" className="text-ui-fg-subtle text-center">
          {t("profile.mfa.qrError")}
        </Text>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="border-ui-border-base bg-ui-bg-base rounded-md border"
      height={220}
      width={220}
    />
  )
}

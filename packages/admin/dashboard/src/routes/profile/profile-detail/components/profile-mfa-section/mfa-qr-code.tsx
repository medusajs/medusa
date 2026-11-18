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
      <div className="flex size-[220px] items-center justify-center rounded-md border border-ui-border-base bg-ui-bg-subtle">
        <Text size="small" className="text-center text-ui-fg-subtle">
          {t("profile.mfa.qrError")}
        </Text>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="rounded-md border border-ui-border-base bg-ui-bg-base"
      height={220}
      width={220}
    />
  )
}

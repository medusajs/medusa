import {
  Button,
  Copy,
  FocusModal,
  Heading,
  Hint,
  OtpInput,
  Text,
} from "@medusajs/ui"
import type { AuthMfaSetupResponse } from "@medusajs/js-sdk"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  useGenerateAuthMfaRecoveryCodes,
  useVerifyAuthMfa,
} from "../../../../../hooks/api"
import { MfaQrCode } from "./mfa-qr-code"

type MfaSetupModalProps = {
  setup: AuthMfaSetupResponse
  onClose: () => void
}

export const MfaSetupModal = ({ setup, onClose }: MfaSetupModalProps) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<"verify" | "recovery-codes">("verify")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const secret = setup.secret
  const otpauthUrl = setup.otpauth_url
  const { mutateAsync: verify, isPending: isVerifying } = useVerifyAuthMfa(
    setup.mfa_factor.id
  )
  const { mutateAsync: generateRecoveryCodes, isPending: isGenerating } =
    useGenerateAuthMfaRecoveryCodes()

  const generateAndShowRecoveryCodes = async () => {
    setError(null)

    try {
      const { recovery_codes } = await generateRecoveryCodes()
      setRecoveryCodes(recovery_codes)
      setStep("recovery-codes")
    } catch (e) {
      setError(
        e instanceof Error ? e.message : t("profile.mfa.recoveryCodesError")
      )
    }
  }

  const handleVerify = async (nextCode = code) => {
    if (isVerified) {
      await generateAndShowRecoveryCodes()
      return
    }

    if (nextCode.length !== 6) {
      return
    }

    setError(null)

    try {
      await verify({ code: nextCode })
      setIsVerified(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : t("profile.mfa.verifyError"))
      setCode("")
      return
    }

    await generateAndShowRecoveryCodes()
  }

  const handleOtpChange = (value: string) => {
    setCode(value)
  }

  const handleDownloadRecoveryCodes = () => {
    const blob = new Blob([recoveryCodes.join("\n")], {
      type: "text/plain;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "medusa-recovery-codes.txt"
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <FocusModal open onOpenChange={(open) => !open && onClose()}>
      <FocusModal.Content className="inset-auto left-1/2 top-1/2 max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-[560px] -translate-x-1/2 -translate-y-1/2">
        <FocusModal.Header>
          <FocusModal.Title asChild>
            <span className="sr-only">
              {step === "verify"
                ? t("profile.mfa.setupTitle")
                : t("profile.mfa.recoveryCodesTitle")}
            </span>
          </FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="overflow-y-auto p-6">
          {step === "verify" ? (
            <div className="flex w-full flex-col items-center gap-y-6">
              <div className="flex flex-col items-center gap-y-2 text-center">
                <Heading>{t("profile.mfa.setupAuthenticatorApp")}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("profile.mfa.setupDescription")}
                </Text>
              </div>
              {secret && otpauthUrl ? (
                <div className="border-ui-border-base flex w-full flex-col items-center gap-y-4 rounded-lg border p-4">
                  <div className="bg-ui-bg-subtle txt-compact-small text-ui-fg-base border-ui-border-base flex max-w-full items-center gap-x-2 rounded-md border px-3 py-2 font-mono">
                    <span className="truncate">{secret}</span>
                    <Copy content={secret} variant="mini" />
                  </div>
                  <MfaQrCode value={otpauthUrl} />
                </div>
              ) : (
                <Hint className="inline-flex" variant="error">
                  {t("profile.mfa.setupError")}
                </Hint>
              )}
              <div className="flex flex-col items-center gap-y-3">
                <OtpInput
                  value={code}
                  onChange={handleOtpChange}
                  onComplete={handleVerify}
                  disabled={
                    isVerifying || isGenerating || !secret || isVerified
                  }
                  autoFocus
                />
                {error && (
                  <Hint className="inline-flex" variant="error">
                    {error}
                  </Hint>
                )}
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-y-4">
              <div>
                <Heading>{t("profile.mfa.recoveryCodesTitle")}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("profile.mfa.recoveryCodesDescription")}
                </Text>
              </div>
              <div className="border-ui-border-base bg-ui-bg-subtle grid grid-cols-2 gap-3 rounded-lg border p-4">
                {recoveryCodes.map((recoveryCode) => {
                  return (
                    <Text key={recoveryCode} size="small" className="font-mono">
                      {recoveryCode}
                    </Text>
                  )
                })}
              </div>
            </div>
          )}
        </FocusModal.Body>
        <FocusModal.Footer>
          {step === "verify" ? (
            <>
              <Button variant="secondary" onClick={onClose}>
                {t("actions.cancel")}
              </Button>
              <Button
                isLoading={isVerifying || isGenerating}
                disabled={(!isVerified && code.length !== 6) || !secret}
                onClick={() => handleVerify()}
              >
                {t("actions.confirm")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleDownloadRecoveryCodes}>
                {t("actions.download")}
              </Button>
              <Copy content={recoveryCodes.join("\n")} asChild>
                <Button variant="secondary">{t("actions.copy")}</Button>
              </Copy>
              <Button onClick={onClose}>{t("actions.complete")}</Button>
            </>
          )}
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

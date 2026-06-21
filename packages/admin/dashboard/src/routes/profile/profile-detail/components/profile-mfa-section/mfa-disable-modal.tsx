import { Button, FocusModal, Heading, Hint, OtpInput, Text } from "@medusajs/ui"
import type { AuthTypes } from "@medusajs/types"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useDisableAuthMfa } from "../../../../../hooks/api"

type MfaDisableModalProps = {
  factor: AuthTypes.AuthMfaDTO
  onClose: () => void
  onSuccess: () => void
}

export const MfaDisableModal = ({
  factor,
  onClose,
  onSuccess,
}: MfaDisableModalProps) => {
  const { t } = useTranslation()
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { mutateAsync, isPending } = useDisableAuthMfa(factor.id)

  const handleDisable = async (nextCode = code) => {
    if (nextCode.length !== 6) {
      return
    }

    setError(null)

    try {
      await mutateAsync({
        method: factor.provider,
        code: nextCode,
      })
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : t("profile.mfa.disableError"))
      setCode("")
    }
  }

  const handleOtpChange = (value: string) => {
    setCode(value)
  }

  return (
    <FocusModal open onOpenChange={(open) => !open && onClose()}>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>{t("profile.mfa.disableTitle")}</FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-[360px] flex-col items-center gap-y-6 text-center">
            <div>
              <Heading>{t("profile.mfa.disableTitle")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("profile.mfa.disableChallengeDescription")}
              </Text>
            </div>
            <OtpInput
              value={code}
              onChange={handleOtpChange}
              onComplete={handleDisable}
              disabled={isPending}
              autoFocus
            />
            {error && (
              <Hint className="inline-flex" variant="error">
                {error}
              </Hint>
            )}
          </div>
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {t("actions.cancel")}
          </Button>
          <Button
            variant="danger"
            isLoading={isPending}
            disabled={code.length !== 6}
            onClick={() => handleDisable()}
          >
            {t("actions.disable")}
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

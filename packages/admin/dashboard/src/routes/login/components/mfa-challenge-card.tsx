import type { AuthTypes } from "@medusajs/types"
import AvatarBox from "../../../components/common/logo-box/avatar-box"
import { MfaChallengeForm } from "./mfa-challenge-form"

type MfaChallengeCardProps = {
  challenge: AuthTypes.AuthMfaChallengeDTO
  onSuccess: (token: string) => void | Promise<void>
  onBack?: () => void
}

export const MfaChallengeCard = ({
  challenge,
  onSuccess,
  onBack,
}: MfaChallengeCardProps) => {
  return (
    <div className="m-4 flex w-full max-w-[280px] flex-col items-center">
      <AvatarBox />
      <MfaChallengeForm
        challenge={challenge}
        onSuccess={onSuccess}
        onBack={onBack}
      />
    </div>
  )
}

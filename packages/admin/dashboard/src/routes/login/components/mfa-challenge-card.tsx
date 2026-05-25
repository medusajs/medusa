import AvatarBox from "../../../components/common/logo-box/avatar-box"
import { AuthMfaChallenge } from "../../../hooks/api"
import { MfaChallengeForm } from "./mfa-challenge-form"

type MfaChallengeCardProps = {
  challenge: AuthMfaChallenge
  onSuccess: (token: string) => void
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

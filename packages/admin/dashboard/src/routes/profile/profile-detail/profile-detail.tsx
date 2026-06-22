import { useMe } from "../../../hooks/api/users"
import { ProfileGeneralSection } from "./components/profile-general-section"
import { ProfileMfaSection } from "./components/profile-mfa-section/profile-mfa-section"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"

export const ProfileDetail = () => {
  const { user, isPending: isLoading, isError, error } = useMe()
  const { getWidgets } = useExtension()

  if (isLoading || !user) {
    return <SingleColumnPageSkeleton sections={2} />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("profile.details.after"),
        before: getWidgets("profile.details.before"),
      }}
    >
      <ProfileGeneralSection user={user} />
      <ProfileMfaSection />
    </SingleColumnPage>
  )
}

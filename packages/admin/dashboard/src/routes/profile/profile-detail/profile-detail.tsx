import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { useMe } from "../../../hooks/api/users"
import { ProfileGeneralSection } from "./components/profile-general-section"
import { ProfileMfaSection } from "./components/profile-mfa-section/profile-mfa-section"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"

export const ProfileDetail = () => {
  const { user, isPending: isLoading, isError, error } = useMe()

  if (isLoading || !user) {
    return <SingleColumnPageSkeleton sections={2} />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="profile.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ProfileGeneralSection">
              <ProfileGeneralSection user={user} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProfileMfaSection">
              <ProfileMfaSection />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

import { FC, useEffect, useState } from "react"
import { useGetPayoutAccountLink } from "../../hooks/admin/stripe-connect/mutations"
import { useSelectedVendor } from "../../context/vendor"
import Spinner from "../../components/atoms/spinner"
import Button from "../../components/fundamentals/button"
import { useBasePath } from "../../utils/routePathing"
import { useNavigate, useParams } from "react-router-dom"
import { BusinessInformationVendorForm } from "../vendors/information/vendor-business-information-form"
import Alert from "../../components/molecules/alert"

export interface PayoutsManageProps {}

export const PayoutsManage: FC<PayoutsManageProps> = () => {
  const navigate = useNavigate()
  const { type } = useParams<{ type: "onboarding" | "update" }>()
  const basePath = useBasePath()
  const { isStoreView, selectedVendor } = useSelectedVendor()
  const [isError, setIsError] = useState<boolean>(false)

  const payoutLinkMutation = useGetPayoutAccountLink(
    selectedVendor?.balance_id,
    isStoreView ? selectedVendor?.id : undefined
  )

  const requiresVendorInformation =
    !selectedVendor?.email || !selectedVendor?.country_code

  const isOnboarding = type === "onboarding"
  const isUpdate = type === "update"

  const navigateToPayoutLink = async () => {
    const result = await payoutLinkMutation.mutateAsync()
    if (result.status < 299) {
      return window.location.replace(result.data.link?.url)
    }

    setIsError(true)
  }

  useEffect(() => {
    if (!selectedVendor || requiresVendorInformation) return
    navigateToPayoutLink()
  }, [requiresVendorInformation, selectedVendor])

  if (requiresVendorInformation)
    return (
      <div>
        <Alert
          variant="default"
          className="mb-6"
          title="Additional Information Required"
          content={
            <>
              We need some additional information about {selectedVendor?.name}{" "}
              before we can setup payouts.
            </>
          }
        />

        <BusinessInformationVendorForm vendor={selectedVendor!} />
      </div>
    )

  return (
    <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto my-4 text-center">
      {isError && (
        <div className="text-center">
          <p>Payouts are not enabled for this vendor.</p>
          <Button variant="secondary" onClick={() => navigate(basePath)}>
            Return to dashboard
          </Button>
        </div>
      )}

      {!isError && !requiresVendorInformation && (
        <>
          <Spinner size="large" variant="secondary" />

          <div className="inter-large-regular">
            {isUpdate && (
              <>
                Redirecting you to your bank account settings. Please wait just
                a moment...
              </>
            )}

            {isOnboarding && (
              <>
                Redirecting you to the onboarding flow to link your bank
                account. Please wait just a moment...
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PayoutsManage

import { AdminPostRegionsReq } from "@medusajs/medusa"
import { useAdminCreateRegion } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../../components/molecules/modal/focus-modal"
import Accordion from "../../../../components/organisms/accordion"
import { useFeatureFlag } from "../../../../context/feature-flag"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import RegionDetailsForm, {
  RegionDetailsFormType,
} from "../components/region-form/region-details-form"
import RegionProvidersForm, {
  RegionProvidersFormType,
} from "../components/region-form/region-providers-form"

type Props = {
  onClose: () => void
}

type NewRegionFormType = {
  details: RegionDetailsFormType
  providers: RegionProvidersFormType
}

const NewRegion = ({ onClose }: Props) => {
  const [sections, setSections] = useState(["details"])
  const form = useForm<NewRegionFormType>({
    defaultValues: {
      details: {
        countries: [],
      },
      providers: {
        payment_providers: undefined,
        fulfillment_providers: undefined,
      },
    },
  })
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form
  const { mutate, isLoading } = useAdminCreateRegion()
  const navigate = useNavigate()
  const notification = useNotification()

  const { isFeatureEnabled } = useFeatureFlag()

  const closeAndReset = () => {
    reset()
    onClose()
  }

  const onSubmit = handleSubmit(
    (data) => {
      const payload: AdminPostRegionsReq = {
        name: data.details.name!,
        countries: data.details.countries.map((c) => c.value),
        currency_code: data.details.currency_code?.value,
        fulfillment_providers: data.providers.fulfillment_providers.map(
          (fp) => fp.value
        ),
        payment_providers: data.providers.payment_providers.map(
          (pp) => pp.value
        ),
        tax_rate: data.details.tax_rate!,
        tax_code: data.details.tax_code || undefined,
      }

      if (isFeatureEnabled("tax_inclusive_pricing")) {
        payload.includes_tax = data.details.includes_tax
      }

      mutate(payload, {
        onSuccess: ({ region }) => {
          notification("Success", "Region created", "success")
          navigate(`/a/settings/regions/${region.id}`)
          closeAndReset()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      })
    },
    (errors) => {
      if (errors.providers && !sections.includes("providers")) {
        setSections((oldSections) => [...oldSections, "providers"])
      }
    }
  )

  return (
    <form className="w-full" onSubmit={onSubmit} noValidate>
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 w-full px-8 flex justify-between">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={closeAndReset}
            >
              <CrossIcon size={20} />
            </Button>
            <div className="gap-x-small flex">
              <Button
                size="small"
                variant="primary"
                loading={isLoading}
                disabled={!isDirty || isLoading}
                type="submit"
              >
                Create region
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="w-full no-scrollbar flex justify-center">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 max-w-[700px] my-16">
            <Accordion
              value={sections}
              onValueChange={setSections}
              type="multiple"
            >
              <Accordion.Item
                title="Details"
                value="details"
                forceMountContent
                required
              >
                <p className="inter-base-regular text-grey-50 mb-xlarge">
                  Add the region details.
                </p>
                <RegionDetailsForm
                  form={nestedForm(form, "details")}
                  isCreate
                />
              </Accordion.Item>
              <Accordion.Item
                title="Providers"
                value="providers"
                forceMountContent
                required
              >
                <p className="inter-base-regular text-grey-50 mb-xlarge">
                  Add which fulfillment and payment providers shoulb be
                  available in this region.
                </p>
                <RegionProvidersForm form={nestedForm(form, "providers")} />
              </Accordion.Item>
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

export default NewRegion

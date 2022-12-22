import { AdminPostRegionsRegionReq, Region } from "@medusajs/medusa"
import { useAdminUpdateRegion } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { useFeatureFlag } from "../../../../../context/feature-flag"
import useNotification from "../../../../../hooks/use-notification"
import { currencies } from "../../../../../utils/currencies"
import { getErrorMessage } from "../../../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../../../utils/fulfillment-providers.mapper"
import { nestedForm } from "../../../../../utils/nested-form"
import paymentProvidersMapper from "../../../../../utils/payment-providers-mapper"
import RegionDetailsForm, {
  RegionDetailsFormType,
} from "../../components/region-form/region-details-form"
import RegionProvidersForm, {
  RegionProvidersFormType,
} from "../../components/region-form/region-providers-form"

type Props = {
  region: Region
  open: boolean
  onClose: () => void
}

type RegionEditFormType = {
  details: RegionDetailsFormType
  providers: RegionProvidersFormType
}

const EditRegionModal = ({ region, onClose, open }: Props) => {
  const form = useForm<RegionEditFormType>({
    defaultValues: getDefaultValues(region),
  })
  const { isFeatureEnabled } = useFeatureFlag()

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form

  const closeAndReset = () => {
    reset(getDefaultValues(region))
    onClose()
  }

  useEffect(() => {
    reset(getDefaultValues(region))
  }, [region])

  const { mutate, isLoading } = useAdminUpdateRegion(region.id)
  const notifcation = useNotification()

  const onSubmit = handleSubmit((data) => {
    const payload: AdminPostRegionsRegionReq = {
      name: data.details.name,
      currency_code: data.details.currency_code?.value,
      payment_providers: data.providers.payment_providers.map((pp) => pp.value),
      fulfillment_providers: data.providers.fulfillment_providers.map(
        (fp) => fp.value
      ),
      countries: data.details.countries.map((c) => c.value),
    }

    if (isFeatureEnabled("tax_inclusive_pricing")) {
      payload.includes_tax = data.details.includes_tax
    }

    mutate(payload, {
      onSuccess: () => {
        notifcation("Success", "Region was successfully updated", "success")
        closeAndReset()
      },
      onError: (err) => {
        notifcation("Error", getErrorMessage(err), "error")
      },
    })
  })

  return (
    <Modal handleClose={closeAndReset} open={open}>
      <Modal.Body>
        <Modal.Header handleClose={closeAndReset}>
          <h1 className="inter-xlarge-semibold">Edit Region Details</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div>
              <h3 className="inter-base-semibold mb-base">Details</h3>
              <RegionDetailsForm form={nestedForm(form, "details")} />
            </div>
            <div className="w-full h-px bg-grey-20 my-xlarge" />
            <div>
              <h3 className="inter-base-semibold mb-base">Providers</h3>
              <RegionProvidersForm form={nestedForm(form, "providers")} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="w-full flex items-center justify-end gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={closeAndReset}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={isLoading}
                disabled={isLoading || !isDirty}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (region: Region): RegionEditFormType => {
  return {
    details: {
      countries: region.countries
        ? region.countries.map((c) => ({
            value: c.iso_2,
            label: c.display_name,
          }))
        : [],
      currency_code: {
        value: region.currency_code,
        label: currencies[region.currency_code.toUpperCase()].name,
      },
      name: region.name,
      tax_code: null,
      tax_rate: null,
      includes_tax: region.includes_tax,
    },
    providers: {
      fulfillment_providers: region.fulfillment_providers
        ? region.fulfillment_providers.map((p) =>
            fulfillmentProvidersMapper(p.id)
          )
        : [],
      payment_providers: region.payment_providers
        ? region.payment_providers.map((p) => paymentProvidersMapper(p.id))
        : [],
    },
  }
}

export default EditRegionModal

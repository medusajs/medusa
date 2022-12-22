import { useAdminCreatePriceList, useAdminUpdatePriceList } from "medusa-react"
import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import { FeatureFlagContext } from "../../../../context/feature-flag"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import {
  mapFormValuesToCreatePriceList,
  mapFormValuesToUpdatePriceListDetails,
  mapFormValuesToUpdatePriceListPrices,
} from "../form/mappers"
import { usePriceListForm } from "../form/pricing-form-context"
import {
  CreatePriceListFormValues,
  HeaderAction,
  PriceListFormProps,
  PriceListFormValues,
  PriceListStatus,
  ViewType,
} from "../types"

const FormHeader = (props: PriceListFormProps & { onClose?: () => void }) => {
  const { handleSubmit } = usePriceListForm()
  const navigate = useNavigate()
  const notification = useNotification()

  const closeForm = () => {
    if (props.viewType !== ViewType.CREATE && props.onClose) {
      props.onClose()
    } else {
      navigate(-1)
    }
  }

  const createPriceList = useAdminCreatePriceList()
  const updatePriceList = useAdminUpdatePriceList(props.id!)

  const { isFeatureEnabled } = useContext(FeatureFlagContext)

  const onPublish = (values: CreatePriceListFormValues) => {
    const data = mapFormValuesToCreatePriceList(values, PriceListStatus.ACTIVE)
    if (isFeatureEnabled("tax_inclusive_pricing")) {
      data.includes_tax = values.includes_tax
    }
    createPriceList.mutate(data, {
      onSuccess: ({ price_list }) => {
        navigate(`/a/pricing/${price_list.id}`)
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  const onSaveAsDraft = (values: CreatePriceListFormValues) => {
    const data = mapFormValuesToCreatePriceList(values, PriceListStatus.DRAFT)
    if (isFeatureEnabled("tax_inclusive_pricing")) {
      data.includes_tax = values.includes_tax
    }
    createPriceList.mutate(data, {
      onSuccess: ({ price_list }) => {
        navigate(`/a/pricing/${price_list.id}`)
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  const onUpdateDetails = (values: PriceListFormValues) => {
    const data = mapFormValuesToUpdatePriceListDetails(values)
    if (isFeatureEnabled("tax_inclusive_pricing")) {
      data.includes_tax = values.includes_tax
    }
    updatePriceList.mutate(data, {
      onSuccess: ({ price_list }) => {
        notification("Success", "Successfully updated price list", "success")
        closeForm()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  const onUpdatePrices = (values: PriceListFormValues) => {
    updatePriceList.mutate(mapFormValuesToUpdatePriceListPrices(values), {
      onSuccess: ({ price_list }) => {
        props.onClose && props.onClose()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  let mainAction: HeaderAction
  let secondaryAction: HeaderAction

  switch (props.viewType) {
    case ViewType.CREATE:
      mainAction = {
        label: "Publish price list",
        onClick: handleSubmit(onPublish),
      }
      secondaryAction = {
        label: "Save as draft",
        onClick: handleSubmit(onSaveAsDraft),
      }
      break
    case ViewType.EDIT_DETAILS:
      mainAction = {
        label: "Save changes",
        onClick: handleSubmit(onUpdateDetails),
      }
      secondaryAction = {
        label: "Cancel",
        onClick: closeForm,
      }
      break
    case ViewType.EDIT_PRICES:
      mainAction = {
        label: "Save changes",
        onClick: handleSubmit(onUpdatePrices),
      }
      secondaryAction = {
        label: "Cancel",
        onClick: closeForm,
      }
      break
  }

  return (
    <div className="medium:w-8/12 w-full px-8 flex justify-between">
      <Button
        size="small"
        variant="ghost"
        onClick={closeForm}
        className="border rounded-rounded w-8 h-8"
      >
        <CrossIcon size={20} />
      </Button>
      <div className="gap-x-small flex">
        <Button
          onClick={secondaryAction.onClick}
          size="small"
          variant="ghost"
          className="border rounded-rounded"
        >
          {secondaryAction.label}
        </Button>
        <Button
          size="small"
          variant="primary"
          onClick={mainAction.onClick}
          className="rounded-rounded"
        >
          {mainAction.label}
        </Button>
      </div>
    </div>
  )
}

export default FormHeader

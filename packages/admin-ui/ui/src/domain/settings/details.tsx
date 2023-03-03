import { Store } from "@medusajs/medusa"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import BreadCrumb from "../../components/molecules/breadcrumb"
import Input from "../../components/molecules/input"
import BodyCard from "../../components/organisms/body-card"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"

type AccountDetailsFormData = {
  name: string
  swap_link_template: string | undefined
  payment_link_template: string | undefined
  invite_link_template: string | undefined
}

const AccountDetails = () => {
  const { register, reset, handleSubmit } = useForm<AccountDetailsFormData>()
  const { store } = useAdminStore()
  const { mutate } = useAdminUpdateStore()
  const notification = useNotification()

  const handleCancel = () => {
    if (store) {
      reset(mapStoreDetails(store))
    }
  }

  useEffect(() => {
    handleCancel()
  }, [store])

  const onSubmit = (data: AccountDetailsFormData) => {
    const validateSwapLinkTemplate = validateUrl(data.swap_link_template)
    const validatePaymentLinkTemplate = validateUrl(data.payment_link_template)
    const validateInviteLinkTemplate = validateUrl(data.invite_link_template)

    if (!validateSwapLinkTemplate) {
      notification("Error", "Malformed swap url", "error")
      return
    }

    if (!validatePaymentLinkTemplate) {
      notification("Error", "Malformed payment url", "error")
      return
    }

    if (!validateInviteLinkTemplate) {
      notification("Error", "Malformed invite url", "error")
      return
    }

    mutate(data, {
      onSuccess: () => {
        notification("Success", "Successfully updated store", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className="flex-col py-5">
      <div className="max-w-[632px]">
        <BreadCrumb
          previousRoute="/a/settings/"
          previousBreadcrumb="Settings"
          currentPage="Store Details"
        />
        <BodyCard
          events={[
            {
              label: "Save",
              type: "button",
              onClick: handleSubmit(onSubmit),
            },
            { label: "Cancel changes", type: "button", onClick: handleCancel },
          ]}
          title="Store Details"
          subtitle="Manage your business details"
        >
          <h6 className="mt-large inter-base-semibold">General</h6>
          <Input
            className="mt-base"
            label="Store name"
            {...register("name")}
            placeholder="Medusa Store"
          />
          <h6 className="mt-2xlarge inter-base-semibold">Advanced settings</h6>
          <Input
            className="mt-base"
            label="Swap link template"
            {...register("swap_link_template")}
            placeholder="https://acme.inc/swap={swap_id}"
          />
          <Input
            className="mt-base"
            label="Draft order link template"
            {...register("payment_link_template")}
            placeholder="https://acme.inc/payment={payment_id}"
          />
          <Input
            className="mt-base"
            label="Invite link template"
            {...register("invite_link_template")}
            placeholder="https://acme-admin.inc/invite?token={invite_token}"
          />
        </BodyCard>
      </div>
    </form>
  )
}

const validateUrl = (address: string | undefined) => {
  if (!address || address === "") {
    return true
  }

  try {
    const url = new URL(address)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

const mapStoreDetails = (store: Store): AccountDetailsFormData => {
  return {
    name: store.name,
    swap_link_template: store.swap_link_template,
    payment_link_template: store.payment_link_template,
    invite_link_template: store.invite_link_template,
  }
}

export default AccountDetails

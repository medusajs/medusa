import { Store } from "@medusajs/medusa"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import BackButton from "../../components/atoms/back-button"
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
  const { t } = useTranslation()

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
      notification(t("Error"), t("Malformed swap url"), "error")
      return
    }

    if (!validatePaymentLinkTemplate) {
      notification(t("Error"), t("Malformed payment url"), "error")
      return
    }

    if (!validateInviteLinkTemplate) {
      notification(t("Error"), t("Malformed invite url"), "error")
      return
    }

    mutate(data, {
      onSuccess: () => {
        notification(t("Success"), t("Successfully updated store"), "success")
      },
      onError: (error) => {
        notification(t("Error"), getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className="flex-col py-5">
      <div className="max-w-[632px]">
        <BackButton
          path="/a/settings/"
          label={t("Back to settings")}
          className="mb-xsmall"
        />
        <BodyCard
          events={[
            {
              label: t("Save"),
              type: "button",
              onClick: handleSubmit(onSubmit),
            },
            { label: t("Cancel"), type: "button", onClick: handleCancel },
          ]}
          title={t("Store Details")}
          subtitle={t("Manage your business details")}
        >
          <div className="gap-y-xlarge mb-large flex flex-col">
            <div>
              <h2 className="inter-base-semibold mb-base">{t("General")}</h2>
              <Input
                label={t("Store name")}
                {...register("name")}
                placeholder={t("Medusa Store")}
              />
            </div>
            <div>
              <h2 className="inter-base-semibold mb-base">
                {t("Advanced settings")}
              </h2>
              <Input
                label={t("Swap link template")}
                {...register("swap_link_template")}
                placeholder="https://acme.inc/swap={swap_id}"
              />
              <Input
                className="mt-base"
                label={t("Draft order link template")}
                {...register("payment_link_template")}
                placeholder="https://acme.inc/payment={payment_id}"
              />
              <Input
                className="mt-base"
                label={t("Invite link template")}
                {...register("invite_link_template")}
                placeholder="https://acme-admin.inc/invite?token={invite_token}"
              />
            </div>
          </div>
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

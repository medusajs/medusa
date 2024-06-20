import { Trash } from "@medusajs/icons"
import { AdminShippingProfileResponse } from "@medusajs/types"
import { Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"
import { useDeleteShippingProfile } from "../../../../../hooks/api/shipping-profiles"

type ShippingProfileGeneralSectionProps = {
  profile: AdminShippingProfileResponse["shipping_profile"]
}

export const ShippingProfileGeneralSection = ({
  profile,
}: ShippingProfileGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteShippingProfile(profile.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("shippingProfile.delete.title"),
      description: t("shippingProfile.delete.description", {
        name: profile.name,
      }),
      verificationText: profile.name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("shippingProfile.delete.successToast", {
            name: profile.name,
          }),
          dismissLabel: t("actions.close"),
        })

        navigate("/settings/locations/shipping-profiles", { replace: true })
      },
      onError: (error) => {
        toast.error(t("general.error"), {
          description: error.message,
          dismissLabel: t("actions.close"),
        })
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{profile.name}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <Trash />,
                  label: t("actions.delete"),
                  onClick: handleDelete,
                },
              ],
            },
          ]}
        />
      </div>
      <SectionRow title={t("fields.type")} value={profile.type} />
    </Container>
  )
}

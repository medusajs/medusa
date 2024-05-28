import { PencilSquare, Trash } from "@medusajs/icons"
import { Container, Heading, Text, toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteCustomerGroup } from "../../../../../hooks/api/customer-groups"
import { HttpTypes } from "@medusajs/types"

type CustomerGroupGeneralSectionProps = {
  group: HttpTypes.AdminCustomerGroup
}

export const CustomerGroupGeneralSection = ({
  group,
}: CustomerGroupGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteCustomerGroup(group.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("customerGroups.delete.title"),
      description: t("customerGroups.delete.description", {
        name: group.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("customerGroups.delete.successToast", {
            name: group.name,
          }),
          dismissLabel: t("actions.close"),
        })

        navigate("/customer-groups", { replace: true })
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
        <Heading>{group.name}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `/customer-groups/${group.id}/edit`,
                },
              ],
            },
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
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("customers.domain")}
        </Text>
        <Text size="small" leading="compact">
          {group.customers?.length || "-"}
        </Text>
      </div>
    </Container>
  )
}

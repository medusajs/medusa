import { PencilSquare, Trash } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { AdminCustomerGroupResponse } from "@medusajs/types"
import { useDeleteCustomerGroup } from "../../../../../hooks/api/customer-groups"

type CustomerGroupGeneralSectionProps = {
  group: AdminCustomerGroupResponse["customer_group"]
}

export const CustomerGroupGeneralSection = ({
  group,
}: CustomerGroupGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteCustomerGroup(group.id)

  const handleDelete = async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/customer-groups", { replace: true })
      },
    })
  }

  return (
    <Container className="flex items-center justify-between px-6 py-4">
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
    </Container>
  )
}

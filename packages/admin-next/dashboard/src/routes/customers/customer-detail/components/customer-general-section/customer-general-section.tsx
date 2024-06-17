import { PencilSquare, Trash } from "@medusajs/icons"
import {
  Container,
  Heading,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteCustomer } from "../../../../../hooks/api/customers"
import { HttpTypes } from "@medusajs/types"

type CustomerGeneralSectionProps = {
  customer: HttpTypes.AdminCustomer
}

export const CustomerGeneralSection = ({
  customer,
}: CustomerGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteCustomer(customer.id)

  const name = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")

  const statusColor = customer.has_account ? "green" : "orange"
  const statusText = customer.has_account
    ? t("customers.fields.registered")
    : t("customers.fields.guest")

  const handleDelete = async () => {
    const res = await prompt({
      title: t("customers.delete.title"),
      description: t("customers.delete.description", {
        email: customer.email,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: customer.email,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("customers.delete.successToast", {
            email: customer.email,
          }),
          dismissLabel: t("actions.close"),
        })

        navigate("/customers", { replace: true })
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
        <Heading>{customer.email}</Heading>
        <div className="flex items-center gap-x-2">
          <StatusBadge color={statusColor}>{statusText}</StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    to: "edit",
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {name || "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.company")}
        </Text>
        <Text size="small" leading="compact">
          {customer.company_name || "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.phone")}
        </Text>
        <Text size="small" leading="compact">
          {customer.phone || "-"}
        </Text>
      </div>
    </Container>
  )
}

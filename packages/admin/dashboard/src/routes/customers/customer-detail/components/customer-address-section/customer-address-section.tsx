import { HttpTypes } from "@medusajs/types"
import { clx, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { Trash } from "@medusajs/icons"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { Listicle } from "../../../../../components/common/listicle"
import { PermissionGuard } from "../../../../../components/common/permission-guard"
import { useDeleteCustomerAddress } from "../../../../../hooks/api/customers"
import { useCustomerPermissions } from "../../../../../hooks/use-resource-permissions"

type CustomerAddressSectionProps = {
  customer: HttpTypes.AdminCustomer
}

export const CustomerAddressSection = ({
  customer,
}: CustomerAddressSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { canDelete } = useCustomerPermissions()
  const { mutateAsync: deleteAddress } = useDeleteCustomerAddress(customer.id)

  const addresses = customer.addresses ?? []

  const handleDelete = async (address: HttpTypes.AdminCustomerAddress) => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("general.areYouSureDescription", {
        entity: t("fields.address"),
        title: address.address_name ?? "n/a",
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: address.address_name ?? "address",
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await deleteAddress(address.id, {
      onSuccess: () => {
        toast.success(
          t("general.success", { name: address.address_name ?? "address" })
        )

        navigate(`/customers/${customer.id}`, { replace: true })
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("addresses.title")}</Heading>
        {/* Only show add link if user has update permission */}
        <PermissionGuard resource="customer" operation="update">
          <Link to={`create-address`} className="text-ui-fg-muted text-xs">
            Add
          </Link>
        </PermissionGuard>
      </div>

      {addresses.length === 0 && (
        <NoRecords
          className={clx({
            "flex h-full flex-col overflow-hidden border-t p-6": true,
          })}
          icon={null}
          title={t("general.noRecordsTitle")}
          message={t("general.noRecordsMessage")}
        />
      )}

      {addresses.map((address) => {
        return (
          <Listicle
            key={address.id}
            labelKey={address.address_name ?? "n/a"}
            descriptionKey={[address.address_1, address.address_2].join(" ")}
          >
            {/* Only show delete action if user has delete permission */}
            {canDelete && (
              <ActionMenu
                groups={[
                  {
                    actions: [
                      {
                        icon: <Trash />,
                        label: t("actions.delete"),
                        onClick: async () => {
                          await handleDelete(address)
                        },
                      },
                    ],
                  },
                ]}
              />
            )}
          </Listicle>
        )
      })}
    </Container>
  )
}

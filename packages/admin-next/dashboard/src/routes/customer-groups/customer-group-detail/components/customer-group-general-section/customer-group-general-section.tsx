import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import type { CustomerGroup } from "@medusajs/medusa"
import { Container, DropdownMenu, Heading, IconButton } from "@medusajs/ui"
import { useAdminDeleteCustomerGroup } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"

type CustomerGroupGeneralSectionProps = {
  group: CustomerGroup
}

export const CustomerGroupGeneralSection = ({
  group,
}: CustomerGroupGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { mutateAsync } = useAdminDeleteCustomerGroup(group.id)

  const handleDelete = async () => {
    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/customer-groups", { replace: true })
      },
    })
  }

  return (
    <Container className="px-6 py-4 flex items-center justify-between">
      <Heading>{group.name}</Heading>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton size="small" variant="transparent">
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <Link to={`/customer-groups/${group.id}/edit`}>
            <DropdownMenu.Item className="flex items-center gap-x-2">
              <PencilSquare className="text-ui-fg-subtle" />
              <span>{t("general.edit")}</span>
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="flex items-center gap-x-2"
            onClick={handleDelete}
          >
            <Trash className="text-ui-fg-subtle" />
            <span>{t("general.delete")}</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </Container>
  )
}

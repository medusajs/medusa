import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
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
import { useDeleteProductCategory } from "../../../../../hooks/api/categories"
import { getIsActiveProps, getIsInternalProps } from "../../../common/utils"

type CategoryGeneralSectionProps = {
  category: HttpTypes.AdminProductCategory
}

export const CategoryGeneralSection = ({
  category,
}: CategoryGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const activeProps = getIsActiveProps(category.is_active, t)
  const internalProps = getIsInternalProps(category.is_internal, t)

  const { mutateAsync } = useDeleteProductCategory(category.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.delete.confirmation", {
        name: category.name,
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
          description: t("categories.delete.successToast", {
            name: category.name,
          }),
          dismissable: true,
          dismissLabel: t("actions.close"),
        })

        navigate("/categories", {
          replace: true,
        })
      },
      onError: (e) => {
        toast.error(t("general.error"), {
          description: e.message,
          dismissable: true,
          dismissLabel: t("actions.close"),
        })
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{category.name}</Heading>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <StatusBadge color={activeProps.color}>
              {activeProps.label}
            </StatusBadge>
            <StatusBadge color={internalProps.color}>
              {internalProps.label}
            </StatusBadge>
          </div>
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
                    // TODO: Enable once we have a delete endpoint
                    disabled: true,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 gap-3 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact">
          {category.description || "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 gap-3 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.handle")}
        </Text>
        <Text size="small" leading="compact">
          /{category.handle}
        </Text>
      </div>
    </Container>
  )
}

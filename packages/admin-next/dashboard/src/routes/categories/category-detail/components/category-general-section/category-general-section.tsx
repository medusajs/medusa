import {
  FolderIllustration,
  PencilSquare,
  Trash,
  TriangleRightMini,
} from "@medusajs/icons"
import { ProductCategory } from "@medusajs/medusa"
import { Container, Heading, StatusBadge, Text, usePrompt } from "@medusajs/ui"
import { useAdminDeleteProductCategory } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"

type CategoryGeneralSectionProps = {
  category: ProductCategory
}

export const CategoryGeneralSection = ({
  category,
}: CategoryGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteProductCategory(category.id)

  const handleDeleteCategory = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.deleteWarning", { name: category.name }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("..", { replace: true })
      },
    })
  }

  const typeColor = category.is_internal ? "blue" : "green"
  const typeText = category.is_internal
    ? t("status.private")
    : t("status.public")

  const statusColor = category.is_active ? "green" : "red"
  const statusText = category.is_active
    ? t("status.active")
    : t("status.inactive")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{category.name}</Heading>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-1">
            <StatusBadge color={typeColor}>{typeText}</StatusBadge>
            <StatusBadge color={statusColor}>{statusText}</StatusBadge>
          </div>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    to: "edit",
                    icon: <PencilSquare />,
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    onClick: handleDeleteCategory,
                    icon: <Trash />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {category.description || "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.handle")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {category.handle ? `/${category.handle}` : "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Path
        </Text>
        <div className="grid grid-cols-[20px_1fr] items-start gap-2">
          <FolderIllustration aria-hidden />
          <Path category={category} />
        </div>
      </div>
    </Container>
  )
}

const getPath = (category: ProductCategory): { name: string; id: string }[] => {
  if (!category.parent_category) {
    return [{ name: category.name, id: category.id }]
  }

  return [
    ...getPath(category.parent_category),
    { name: category.name, id: category.id },
  ]
}

const Path = ({ category }: { category: ProductCategory }) => {
  const path = getPath(category)

  return (
    <div className="txt-compact-small flex flex-wrap items-center gap-x-0.5 gap-y-2">
      {path.map((p, i) => {
        const isLast = i === path.length - 1

        if (isLast) {
          return <div key={i}>{p.name}</div>
        }

        return (
          <div key={i} className="flex items-center gap-x-0.5">
            <Link to={`/categories/${p.id}`}>{p.name}</Link>
            <TriangleRightMini />
          </div>
        )
      })}
    </div>
  )
}

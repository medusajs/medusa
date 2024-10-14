import {
  FolderIllustration,
  PencilSquare,
  TriangleRightMini,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, Container, Heading, Text, Tooltip } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { LinkButton } from "../../../../../components/common/link-button"
import { Skeleton } from "../../../../../components/common/skeleton"
import { useProductCategory } from "../../../../../hooks/api/categories"
import { getCategoryChildren, getCategoryPath } from "../../../common/utils"

type CategoryOrganizeSectionProps = {
  category: HttpTypes.AdminProductCategory
}

export const CategoryOrganizeSection = ({
  category,
}: CategoryOrganizeSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("categories.organize.header")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("categories.organize.action"),
                  icon: <PencilSquare />,
                  to: `organize`,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start gap-3 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("categories.fields.path.label")}
        </Text>
        <PathDisplay category={category} />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start gap-3 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("categories.fields.children.label")}
        </Text>
        <ChildrenDisplay category={category} />
      </div>
    </Container>
  )
}

const PathDisplay = ({
  category,
}: {
  category: HttpTypes.AdminProductCategory
}) => {
  const [expanded, setExpanded] = useState(false)

  const { t } = useTranslation()

  const {
    product_category: withParents,
    isLoading,
    isError,
    error,
  } = useProductCategory(category.id, {
    include_ancestors_tree: true,
    fields: "id,name,*parent_category",
  })

  const chips = useMemo(() => getCategoryPath(withParents), [withParents])

  if (isLoading || !withParents) {
    return <Skeleton className="h-5 w-16" />
  }

  if (isError) {
    throw error
  }

  if (!chips.length) {
    return (
      <Text size="small" leading="compact">
        -
      </Text>
    )
  }

  if (chips.length > 1 && !expanded) {
    return (
      <div className="grid grid-cols-[20px_1fr] items-start gap-x-2">
        <FolderIllustration />
        <div className="flex w-full items-center gap-x-0.5 overflow-hidden">
          <Tooltip content={t("categories.fields.path.tooltip")}>
            <button
              className="outline-none"
              type="button"
              onClick={() => setExpanded(true)}
            >
              <Text size="xsmall" leading="compact" weight="plus">
                ...
              </Text>
            </button>
          </Tooltip>
          <div className="flex size-[15px] shrink-0 items-center justify-center">
            <TriangleRightMini />
          </div>
          <Text
            size="xsmall"
            leading="compact"
            weight="plus"
            className="truncate"
          >
            {chips[chips.length - 1].name}
          </Text>
        </div>
      </div>
    )
  }

  if (chips.length > 1 && expanded) {
    return (
      <div className="grid grid-cols-[20px_1fr] items-start gap-x-2">
        <FolderIllustration />
        <div className="gap- flex flex-wrap items-center gap-x-0.5 gap-y-1">
          {chips.map((chip, index) => {
            return (
              <div key={chip.id} className="flex items-center gap-x-0.5">
                {index === chips.length - 1 ? (
                  <Text size="xsmall" leading="compact" weight="plus">
                    {chip.name}
                  </Text>
                ) : (
                  <LinkButton
                    to={`/categories/${chip.id}`}
                    className="txt-compact-xsmall-plus text-ui-fg-subtle hover:text-ui-fg-base focus-visible:text-ui-fg-base"
                  >
                    {chip.name}
                  </LinkButton>
                )}
                {index < chips.length - 1 && <TriangleRightMini />}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-start gap-x-2">
      {chips.map((chip, index) => (
        <div key={chip.id} className="flex items-center gap-x-0.5">
          <Text size="xsmall" leading="compact" weight="plus">
            {chip.name}
          </Text>
          {index < chips.length - 1 && <TriangleRightMini />}
        </div>
      ))}
    </div>
  )
}

const ChildrenDisplay = ({
  category,
}: {
  category: HttpTypes.AdminProductCategory
}) => {
  const {
    product_category: withChildren,
    isLoading,
    isError,
    error,
  } = useProductCategory(category.id, {
    include_descendants_tree: true,
    fields: "id,name,category_children",
  })

  const chips = useMemo(() => getCategoryChildren(withChildren), [withChildren])

  if (isLoading || !withChildren) {
    return <Skeleton className="h-5 w-16" />
  }

  if (isError) {
    throw error
  }

  if (!chips.length) {
    return (
      <Text size="small" leading="compact">
        -
      </Text>
    )
  }

  return (
    <div className="flex w-full flex-wrap gap-1">
      {chips.map((chip) => (
        <Badge key={chip.id} size="2xsmall" className="max-w-full" asChild>
          <Link to={`/categories/${chip.id}`}>
            <span className="truncate">{chip.name}</span>
          </Link>
        </Badge>
      ))}
    </div>
  )
}

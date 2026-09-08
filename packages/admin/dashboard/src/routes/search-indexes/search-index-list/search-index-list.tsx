import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { Spinner } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Badge,
  Button,
  Container,
  Heading,
  StatusBadge,
  Text,
  toast,
  Tooltip,
  usePrompt,
} from "@medusajs/ui"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { LayoutComposer } from "../../../components/layout-composer"
import {
  useReindexSearchIndex,
  useSearchIndexes,
} from "../../../hooks/api/search-indexes"

const statusColor = (
  status: HttpTypes.AdminSearchIndexStatus
): "green" | "orange" | "grey" | "red" => {
  switch (status) {
    case "ready":
      return "green"
    case "building":
      return "orange"
    case "error":
      return "red"
    default:
      return "grey"
  }
}

const fieldTooltip = (field: HttpTypes.AdminSearchIndexField) => {
  const capabilities = [
    field.type,
    field.searchable ? "searchable" : null,
    field.filterable ? "filterable" : null,
    field.sortable ? "sortable" : null,
    field.facetable ? "facetable" : null,
  ].filter(Boolean)

  return capabilities.join(" · ")
}

const SearchIndexCard = ({
  index,
}: {
  index: HttpTypes.AdminSearchIndex
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync, isPending } = useReindexSearchIndex()

  const handleReindex = async () => {
    const confirmed = await prompt({
      title: t("searchIndexes.reindexConfirmationTitle", {
        name: index.name,
      }),
      description: t("searchIndexes.reindexConfirmation", {
        name: index.name,
      }),
      confirmText: t("searchIndexes.reindex"),
      cancelText: t("actions.cancel"),
    })

    if (!confirmed) {
      return
    }

    await mutateAsync(index.name, {
      onSuccess: () => {
        toast.success(t("searchIndexes.reindexSuccess", { name: index.name }))
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">{index.name}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("searchIndexes.providerLabel")}: {index.provider}
          </Text>
        </div>
        <div className="flex items-center gap-x-2">
          <StatusBadge color={statusColor(index.status)}>
            {t(`searchIndexes.status.${index.status}`)}
          </StatusBadge>
          <Button
            size="small"
            variant="secondary"
            onClick={handleReindex}
            isLoading={isPending}
            disabled={index.status === "building"}
          >
            {t("searchIndexes.reindex")}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("searchIndexes.fieldsLabel")}
        </Text>
        {index.fields.length ? (
          <div className="flex flex-wrap gap-2">
            {index.fields.map((field) => (
              <Tooltip key={field.name} content={fieldTooltip(field)}>
                <span>
                  <Badge size="2xsmall">{field.name}</Badge>
                </span>
              </Tooltip>
            ))}
          </div>
        ) : (
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("searchIndexes.noFields")}
          </Text>
        )}
      </div>
    </Container>
  )
}

export const SearchIndexList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { search_indexes, enabled, isLoading, isError, error } =
    useSearchIndexes()

  useEffect(() => {
    if (!isLoading && enabled === false) {
      navigate(-1)
    }
  }, [enabled, isLoading, navigate])

  if (isError) {
    throw error
  }

  if (isLoading || enabled === false) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="search.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      hasOutlet={false}
      sections={{
        main: (
          <LayoutComposer.Entry id="SearchIndexList">
            <div className="flex flex-col gap-y-3">
              <Container className="p-0">
                <div className="px-6 py-4">
                  <Heading>{t("searchIndexes.domain")}</Heading>
                  <Text className="text-ui-fg-subtle" size="small">
                    {t("searchIndexes.subtitle")}
                  </Text>
                </div>
              </Container>
              {search_indexes?.length ? (
                search_indexes.map((index) => (
                  <SearchIndexCard key={index.name} index={index} />
                ))
              ) : (
                <Container className="p-0">
                  <div className="px-6 py-4">
                    <Text
                      size="small"
                      leading="compact"
                      className="text-ui-fg-subtle"
                    >
                      {t("searchIndexes.list.noRecordsMessage")}
                    </Text>
                  </div>
                </Container>
              )}
            </div>
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}

import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Container,
  createDataTableColumnHelper,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { DataTable } from "../../../../../components/data-table"
import {
  useDeleteReturnReason,
  useReturnReasons,
} from "../../../../../hooks/api/return-reasons"
import { useReturnReasonTableColumns } from "../../../../../hooks/table/columns"
import { useReturnReasonTableQuery } from "../../../../../hooks/table/query"

const PAGE_SIZE = 20

export const ReturnReasonListTable = () => {
  const { t } = useTranslation()
  const { searchParams } = useReturnReasonTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { return_reasons, count, isLoading, isError, error } = useReturnReasons(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y px-0 py-0">
      <DataTable
        data={return_reasons}
        columns={columns}
        rowCount={count}
        pageSize={PAGE_SIZE}
        getRowId={(row) => row.id}
        heading={t("returnReasons.domain")}
        subHeading={t("returnReasons.subtitle")}
        emptyState={{
          empty: {
            heading: t("general.noRecordsMessage"),
          },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        }}
        actions={[
          {
            label: t("actions.create"),
            to: "create",
          },
        ]}
        isLoading={isLoading}
        enableSearch={true}
      />
    </Container>
  )
}

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminReturnReason>()

const useColumns = () => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const base = useReturnReasonTableColumns()

  const { mutateAsync } = useDeleteReturnReason()

  const handleDelete = useCallback(
    async (returnReason: HttpTypes.AdminReturnReason) => {
      const confirm = await prompt({
        title: t("general.areYouSure"),
        description: t("returnReasons.delete.confirmation", {
          label: returnReason.label,
        }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!confirm) {
        return
      }

      await mutateAsync(returnReason.id, {
        onSuccess: () => {
          toast.success(
            t("returnReasons.delete.successToast", {
              label: returnReason.label,
            })
          )
        },
        onError: (e) => {
          toast.error(e.message)
        },
      })
    },
    [t, prompt, mutateAsync]
  )

  return useMemo(
    () => [
      ...base,
      columnHelper.action({
        actions: (ctx) => [
          [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              onClick: () =>
                navigate(
                  `/settings/return-reasons/${ctx.row.original.id}/edit`
                ),
            },
          ],
          [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: () => handleDelete(ctx.row.original),
            },
          ],
        ],
      }),
    ],
    [base, handleDelete, navigate, t]
  )
}

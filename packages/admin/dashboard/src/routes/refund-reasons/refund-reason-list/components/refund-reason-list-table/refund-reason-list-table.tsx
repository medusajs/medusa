import { PencilSquare, Trash } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import {
  Container,
  createDataTableColumnHelper,
  toast,
  usePrompt,
} from "@zjedene-medusa/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { DataTable } from "../../../../../components/data-table"
import {
  useDeleteRefundReasonLazy,
  useRefundReasons,
} from "../../../../../hooks/api"
import { useRefundReasonTableColumns } from "../../../../../hooks/table/columns"
import { useRefundReasonTableQuery } from "../../../../../hooks/table/query"

const PAGE_SIZE = 20

export const RefundReasonListTable = () => {
  const { t } = useTranslation()
  const { searchParams } = useRefundReasonTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { refund_reasons, count, isLoading, isError, error } = useRefundReasons(
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
        data={refund_reasons}
        columns={columns}
        rowCount={count}
        pageSize={PAGE_SIZE}
        getRowId={(row) => row.id}
        heading={t("refundReasons.domain")}
        subHeading={t("refundReasons.subtitle")}
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

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminRefundReason>()

const useColumns = () => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const base = useRefundReasonTableColumns()

  const { mutateAsync } = useDeleteRefundReasonLazy()

  const handleDelete = useCallback(
    async (refundReason: HttpTypes.AdminRefundReason) => {
      const confirm = await prompt({
        title: t("general.areYouSure"),
        description: t("refundReasons.delete.confirmation", {
          label: refundReason.label,
        }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!confirm) {
        return
      }

      await mutateAsync(refundReason.id, {
        onSuccess: () => {
          toast.success(t("refundReasons.delete.successToast"))
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
                  `/settings/refund-reasons/${ctx.row.original.id}/edit`
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

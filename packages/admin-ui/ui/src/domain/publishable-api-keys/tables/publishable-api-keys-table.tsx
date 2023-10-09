import { useEffect, useState } from "react"
import moment from "moment"
import { debounce } from "lodash"
import { Column, Row, usePagination, useTable } from "react-table"

import {
  useAdminDeletePublishableApiKey,
  useAdminPublishableApiKeys,
  useAdminRevokePublishableApiKey,
} from "medusa-react"
import { PublishableApiKey } from "@medusajs/medusa"
import { Translation, useTranslation } from "react-i18next"

import TableContainer from "../../../components/organisms/table-container"
import Table from "../../../components/molecules/table"
import { ActionType } from "../../../components/molecules/actionables"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import StatusIndicator from "../../../components/fundamentals/status-indicator"
import StopIcon from "../../../components/fundamentals/icons/stop-icon"
import Tooltip from "../../../components/atoms/tooltip"
import CheckIcon from "../../../components/fundamentals/icons/check-icon"
import DeletePrompt from "../../../components/organisms/delete-prompt"

const PAGE_SIZE = 12

const COLUMNS: Column<PublishableApiKey>[] = [
  {
    accessor: "title",
    Header: (
      <div className="text-small font-semibold text-gray-500">
        <Translation>{(t) => t("tables-name", "Name")}</Translation>
      </div>
    ),
    Cell: ({ row: { original } }) => {
      return <span className="text-gray-900">{original.title}</span>
    },
  },
  {
    accessor: "id",
    Header: (
      <div className="text-small font-semibold text-gray-500">
        {" "}
        <Translation>{(t) => t("tables-token", "Token")}</Translation>
      </div>
    ),
    Cell: ({ row: { original } }) => {
      const [copied, setCopied] = useState(false)

      const onClick = () => {
        setCopied(true)
        navigator.clipboard.writeText(original.id)
      }

      return (
        <Tooltip
          delayDuration={300}
          onMouseLeave={debounce(() => setCopied(false), 1000)}
          content={
            copied ? (
              <span className="flex flex-row items-center justify-between gap-1">
                <CheckIcon size={16} className="text-green-700" />{" "}
                <Translation>{(t) => t("tables-done", "done")}</Translation>
              </span>
            ) : (
              <span onClick={onClick} className="cursor-pointer">
                <Translation>
                  {(t) => t("tables-copy-to-clipboard", "Copy to clipboard")}
                </Translation>
              </span>
            )
          }
        >
          <span className="text-gray-500">{original.id}</span>
        </Tooltip>
      )
    },
  },
  {
    accessor: "created_at",
    Header: (
      <div className="text-small font-semibold text-gray-500">
        {" "}
        <Translation>{(t) => t("tables-created", "Created")}</Translation>
      </div>
    ),
    Cell: ({ row: { original } }) => {
      return (
        <span className="text-gray-900">
          {moment(original.created_at).format("MMM Do YYYY, h:mm:ss")}
        </span>
      )
    },
  },
  {
    accessor: "revoked_at",
    Header: (
      <div className="text-small font-semibold text-gray-500">
        {" "}
        <Translation>{(t) => t("tables-status", "Status")}</Translation>
      </div>
    ),
    Cell: ({ row: { original } }) => {
      const { t } = useTranslation()
      return (
        <span className="min-w-[50px] text-gray-900">
          {original.revoked_at ? (
            <StatusIndicator
              title={t("tables-revoked", "Revoked")}
              variant="danger"
            />
          ) : (
            <StatusIndicator
              title={t("tables-live", "Live")}
              variant="success"
            />
          )}
        </span>
      )
    },
  },
]

type PublishableKeyTableRowProps = {
  row: Row<PublishableApiKey>
  isRevoked: boolean
  showDetails: () => void
  showChannelsModal: () => void
}

/**
 * Component rendering a single PK table row.
 */
function PublishableKeyTableRow(props: PublishableKeyTableRowProps) {
  const { row, isRevoked, showChannelsModal, showDetails } = props
  const pubKeyId = row.original.id

  const [showDelete, setShowDelete] = useState(false)
  const [showRevoke, setShowRevoke] = useState(false)
  const { t } = useTranslation()

  const { mutateAsync: revokePublicKey } =
    useAdminRevokePublishableApiKey(pubKeyId)

  const { mutateAsync: deletePublicKey } =
    useAdminDeletePublishableApiKey(pubKeyId)

  const actions: ActionType[] = [
    {
      label: t("tables-edit-api-key-details", "Edit API key details"),
      onClick: showDetails,
      icon: <EditIcon size={16} />,
    },
    {
      label: t("tables-edit-sales-channels", "Edit sales channels"),
      onClick: showChannelsModal,
      icon: <EditIcon size={16} />,
    },
    {
      label: t("tables-copy-token", "Copy token"),
      onClick: () => navigator.clipboard.writeText(pubKeyId),
      icon: <ClipboardCopyIcon size={16} />,
    },
    {
      label: t("tables-revoke-token", "Revoke token"),
      onClick: () => setShowRevoke(true),
      icon: <StopIcon size={16} />,
      disabled: isRevoked,
    },
    {
      label: t("tables-delete-api-key", "Delete API key"),
      onClick: () => setShowDelete(true),
      icon: <TrashIcon size={16} />,
      variant: "danger",
    },
  ]

  return (
    <>
      <Table.Row {...props.row.getRowProps()} actions={actions}>
        {props.row.cells.map((cell) => (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell")}
          </Table.Cell>
        ))}
      </Table.Row>

      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(false)}
          onDelete={async () => deletePublicKey()}
          confirmText={t("tables-yes-delete", "Yes, delete")}
          successText={t("tables-api-key-deleted", "API key deleted")}
          text={t(
            "tables-are-you-sure-you-want-to-delete-this-public-key",
            "Are you sure you want to delete this public key?"
          )}
          heading={t("tables-delete-key", "Delete key")}
        />
      )}

      {showRevoke && (
        <DeletePrompt
          handleClose={() => setShowRevoke(false)}
          onDelete={async () => revokePublicKey()}
          confirmText={t("tables-yes-revoke", "Yes, revoke")}
          successText={t("tables-api-key-revoked", "API key revoked")}
          text={t(
            "tables-are-you-sure-you-want-to-revoke-this-public-key",
            "Are you sure you want to revoke this public key?"
          )}
          heading={t("tables-revoke-key", "Revoke key")}
        />
      )}
    </>
  )
}

type PublishableApiKeysTableProps = {
  showDetailsModal: (pubKey: PublishableApiKey) => void
  showChannelsModal: (pubKey: PublishableApiKey) => void
}

/**
 * Container component that displays paginated publishable api keys table.
 */
function PublishableApiKeysTable(props: PublishableApiKeysTableProps) {
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const { t } = useTranslation()

  const {
    publishable_api_keys: keys,
    count,
    isLoading,
  } = useAdminPublishableApiKeys({ offset, limit: PAGE_SIZE })

  const table = useTable(
    {
      columns: COLUMNS,
      data: keys || [],
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: PAGE_SIZE,
        selectedRowIds: {},
      },
      pageCount: numPages,
      autoResetSelectedRows: false,
      autoResetPage: false,
      getRowId: (row) => row.id,
    },
    usePagination
  )

  useEffect(() => {
    if (typeof count !== "undefined") {
      setNumPages(Math.ceil(count / PAGE_SIZE))
    }
  }, [count])

  const handleNext = () => {
    if (table.canNextPage) {
      setOffset((old) => old + table.state.pageSize)
      setCurrentPage((old) => old + 1)
      table.nextPage()
    }
  }

  const handlePrev = () => {
    if (table.canPreviousPage) {
      setOffset((old) => Math.max(old - table.state.pageSize, 0))
      setCurrentPage((old) => old - 1)
      table.previousPage()
    }
  }

  return (
    <TableContainer
      hasPagination
      isLoading={isLoading}
      numberOfRows={PAGE_SIZE}
      pagingState={{
        count,
        offset,
        title: t("tables-api-keys", "API Keys"),
        pageCount: table.pageCount,
        pageSize: offset + table.rows.length,
        currentPage: table.state.pageIndex + 1,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: table.canNextPage,
        hasPrev: table.canPreviousPage,
      }}
    >
      <Table {...table.getTableProps()}>
        {/* === HEADER === */}
        {table.headerGroups.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => (
              <Table.HeadCell {...col.getHeaderProps()}>
                {col.render("Header")}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        ))}

        {/* === BODY === */}
        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map((row) => {
            table.prepareRow(row)
            return (
              <PublishableKeyTableRow
                key={row.id}
                row={row}
                showDetails={() => props.showDetailsModal(row.original)}
                showChannelsModal={() => props.showChannelsModal(row.original)}
                isRevoked={!!row.original.revoked_at}
              />
            )
          })}
        </Table.Body>
      </Table>

      {/* === PLACEHOLDER === */}
      {!keys?.length && !isLoading && (
        <div className="flex h-[480px] w-[100%] items-center justify-center">
          <span className="text-gray-400">
            {t(
              "tables-no-keys-yet-use-the-above-button-to-create-your-first-publishable-key",
              "No keys yet, use the above button to create your first publishable key"
            )}
          </span>
        </div>
      )}
    </TableContainer>
  )
}

export default PublishableApiKeysTable

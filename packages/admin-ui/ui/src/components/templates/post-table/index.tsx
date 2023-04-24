import { FC, useState } from "react"
import { Row, usePagination, useTable } from "react-table"
import { useNavigate } from "react-router-dom"
import { Post } from "@medusajs/medusa"
import clsx from "clsx"
import capitalize from "lodash/capitalize"
import { HomeIcon } from "@heroicons/react/24/outline"
import Table from "../../molecules/table"
import usePageTableColumns from "./use-post-table-columns"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import useQueryFilters from "../../../hooks/use-query-filters"
import { DeletePostPrompt } from "../../../domain/editor/components/molecules/delete-post-prompt"
import { ConfirmSetHomePagePrompt } from "../../../domain/editor/components/molecules/confirm-set-home-page-prompt"
import {
  useAdminDuplicatePost,
  useAdminUpdatePost,
} from "../../../hooks/admin/posts"
import { PostStatus, PostType } from "../../../types/shared"
import { ActionType } from "../../molecules/actionables"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"

export interface PostTableProps {
  type: Post["type"]
  posts: Post[]
  count: number
}

export interface PostTablePropsRowProps {
  row: Row<Post>
  type: Post["type"]
  className?: string
}

const PostTableRow: FC<PostTablePropsRowProps> = ({ className, type, row }) => {
  const post = row.original
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmSetHomePage, setConfirmSetHomePage] = useState(false)
  const { mutateAsync: updatePost } = useAdminUpdatePost(post.id, type)
  const { mutateAsync: duplicatePost } = useAdminDuplicatePost(post.id, type)
  const isPage = type === "page"
  const isHomePage = post.is_home_page

  const getDetailPagePath = () => `/admin/editor/${type}/${post.id}`

  const handleEditClick = () => navigate(getDetailPagePath())

  const handleDuplicateClick = async () => await duplicatePost({})

  const handleSetAsHomePageClick = () => setConfirmSetHomePage(true)

  const handleDeleteClick = () => setConfirmDelete(true)

  const actions = [
    {
      label: "Edit",
      onClick: handleEditClick,
      icon: <EditIcon size={20} />,
    },
    {
      label: "Duplicate",
      onClick: handleDuplicateClick,
      icon: <DuplicateIcon size={20} />,
    },
    {
      label: "Set as home page",
      onClick: handleSetAsHomePageClick,
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      label: "Delete",
      onClick: handleDeleteClick,
      icon: <TrashIcon size={20} />,
      variant: "danger" as ActionType["variant"],
    },
  ]

  const filteredActions = actions.filter((action) => {
    if (!isPage || isHomePage) return action.label !== "Set as home page"

    return true
  })

  return (
    <>
      <Table.Row
        {...row.getRowProps()}
        color="inherit"
        linkTo={getDetailPagePath()}
        className={clsx("group", className)}
        actions={filteredActions}
      >
        {row.cells.map((cell, index) =>
          cell.render("Cell", { key: cell.column.id, index })
        )}
      </Table.Row>

      {confirmDelete && (
        <DeletePostPrompt
          post={row.original}
          handleClose={() => setConfirmDelete(false)}
          successText={`${capitalize(type)} deleted`}
        />
      )}

      {isPage && !isHomePage && confirmSetHomePage && (
        <ConfirmSetHomePagePrompt
          post={row.original}
          handleClose={() => setConfirmSetHomePage(false)}
          onConfirm={async () => {
            await updatePost({
              status: PostStatus.PUBLISHED,
              is_home_page: true,
            })
          }}
        />
      )}
    </>
  )
}

const PostTable: FC<PostTableProps> = ({
  type = PostType.POST,
  posts,
  count,
}) => {
  const columns = usePageTableColumns()
  const {
    // q: query,
    queryObject,
    // paginate,
    // setQuery,
  } = useQueryFilters({
    additionalFilters: { expand: "groups" },
    limit: 15,
    offset: 0,
  })
  const table = useTable(
    {
      data: posts,
      columns,
      initialState: {
        pageSize: queryObject.limit,
        pageIndex: queryObject.offset / queryObject.limit,
      },
      pageCount: Math.ceil(count / queryObject.limit),
      manualPagination: true,
      autoResetPage: false,
    },
    usePagination
  )

  // const handleNext = () => {
  //   if (!table.canNextPage) {
  //     return
  //   }

  //   paginate(1)
  //   table.nextPage()
  // }

  // const handlePrev = () => {
  //   if (!table.canPreviousPage) {
  //     return
  //   }

  //   paginate(-1)
  //   table.previousPage()
  // }

  // const handleSearch = (text: string) => {
  //   setQuery(text)

  //   if (text) {
  //     table.gotoPage(0)
  //   }
  // }

  const sortedRows = table.rows.sort((a, b) =>
    a.original.is_home_page ? -1 : b.original.is_home_page ? 1 : 0
  )

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full">
      {/* <Table enableSearch handleSearch={handleSearch} searchValue={query}> */}
      <Table>
        <Table.Head>
          {table.headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>

        <Table.Body {...table.getTableBodyProps()}>
          {sortedRows.map((row) => {
            table.prepareRow(row)

            return (
              <PostTableRow
                key={row.original.id}
                type={type}
                row={row}
                className="[&>td]:py-2"
              />
            )
          })}
        </Table.Body>
      </Table>

      {/* <TablePagination
        count={count!}
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + table.rows.length}
        title="Items"
        currentPage={table.state.pageIndex + 1}
        pageCount={table.pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={table.canNextPage}
        hasPrev={table.canPreviousPage}
      /> */}
    </div>
  )
}

export default PostTable

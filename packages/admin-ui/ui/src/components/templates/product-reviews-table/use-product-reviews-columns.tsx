import moment from "moment"
import { useMemo } from "react"

export const useProductReviewsColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Date added",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
      {
        Header: "Product",
        accessor: "product_id",
        // Cell: ({ row }) => (
        //   <CustomerAvatarItem
        //     customer={row.original}
        //     color={getColor(row.index)}
        //   />
        // ),
      },
      {
        Header: "User",
        accessor: "user_id",
        // Cell: ({ row }) => (
        //   <CustomerAvatarItem
        //     customer={row.original}
        //     color={getColor(row.index)}
        //   />
        // ),
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Content",
        accessor: "content",
      },
      {
        Header: "",
        accessor: "col",
      },
      {
        Header: "Rating",
        accessor: "rating",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Last updated",
        accessor: "updated_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
    ],
    []
  )

  return [columns]
}

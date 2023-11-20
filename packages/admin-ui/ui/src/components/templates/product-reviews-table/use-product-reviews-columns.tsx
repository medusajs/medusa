import moment from "moment"
import { useMemo } from "react"
import { useTranslation } from 'react-i18next';

export const useProductReviewsColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      {
        Header: t("Date added"),
        accessor: "created_at",
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
      {
        Header: t("Product"),
        accessor: "product",
        // Cell: ({ row }) => (
        //   <CustomerAvatarItem
        //     customer={row.original}
        //     color={getColor(row.index)}
        //   />
        // ),
      },
      {
        Header: t("User"),
        accessor: "user_id",
        // Cell: ({ row }) => (
        //   <CustomerAvatarItem
        //     customer={row.original}
        //     color={getColor(row.index)}
        //   />
        // ),
      },
      {
        Header: t("Title"),
        accessor: "title",
      },
      {
        Header: t("Content"),
        accessor: "content",
      },
      {
        Header: t(""),
        accessor: "col",
      },
      {
        Header: t("Rating"),
        accessor: "rating",
      },
      {
        Header: t("Status"),
        accessor: "status",
      },
      {
        Header: t("Last updated"),
        accessor: "updated_at",
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
    ],
    [t] // Include any dependencies for useMemo, if needed
  );

  return [columns];
};

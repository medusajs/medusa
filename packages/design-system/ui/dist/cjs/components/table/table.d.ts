import * as React from "react";
interface TablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
    count: number;
    pageSize: number;
    pageIndex: number;
    pageCount: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    translations?: {
        of?: string;
        results?: string;
        pages?: string;
        prev?: string;
        next?: string;
    };
    previousPage: () => void;
    nextPage: () => void;
}
declare const Table: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableElement> & React.RefAttributes<HTMLTableElement>> & {
    Row: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableRowElement> & React.RefAttributes<HTMLTableRowElement>>;
    Cell: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>>;
    Header: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>;
    HeaderCell: React.ForwardRefExoticComponent<React.TdHTMLAttributes<HTMLTableCellElement> & React.RefAttributes<HTMLTableCellElement>>;
    Body: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLTableSectionElement> & React.RefAttributes<HTMLTableSectionElement>>;
    Pagination: React.ForwardRefExoticComponent<TablePaginationProps & React.RefAttributes<HTMLDivElement>>;
};
export { Table };

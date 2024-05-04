"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const tslib_1 = require("tslib");
const icons_1 = require("@medusajs/icons");
const React = tslib_1.__importStar(require("react"));
const button_1 = require("../button");
const clx_1 = require("../../utils/clx");
/**
 * This component is based on the table element and its various children:
 *
 * - `Table`: `table`
 * - `Table.Header`: `thead`
 * - `Table.Row`: `tr`
 * - `Table.HeaderCell`: `th`
 * - `Table.Body`: `tbody`
 * - `Table.Cell`: `td`
 *
 * Each component supports the props or attributes of its equivalent HTML element.
 */
const Root = React.forwardRef(({ className, ...props }, ref) => (React.createElement("table", { ref: ref, className: (0, clx_1.clx)("text-ui-fg-subtle txt-compact-small w-full", className), ...props })));
Root.displayName = "Table";
const Row = React.forwardRef(({ className, ...props }, ref) => (React.createElement("tr", { ref: ref, className: (0, clx_1.clx)("bg-ui-bg-base hover:bg-ui-bg-base-hover border-ui-border-base transition-fg border-b", "[&_td:last-child]:pr-6 [&_th:last-child]:pr-6", "[&_td:first-child]:pl-6 [&_th:first-child]:pl-6", className), ...props })));
Row.displayName = "Table.Row";
const Cell = React.forwardRef(({ className, ...props }, ref) => (React.createElement("td", { ref: ref, className: (0, clx_1.clx)("h-12 pr-6", className), ...props })));
Cell.displayName = "Table.Cell";
const Header = React.forwardRef(({ className, ...props }, ref) => (React.createElement("thead", { ref: ref, className: (0, clx_1.clx)("border-ui-border-base txt-compact-small-plus [&_tr:hover]:bg-ui-bg-base border-y", className), ...props })));
Header.displayName = "Table.Header";
const HeaderCell = React.forwardRef(({ className, ...props }, ref) => (React.createElement("th", { ref: ref, className: (0, clx_1.clx)("txt-compact-small-plus h-12 pr-6 text-left", className), ...props })));
HeaderCell.displayName = "Table.HeaderCell";
const Body = React.forwardRef(({ className, ...props }, ref) => (React.createElement("tbody", { ref: ref, className: (0, clx_1.clx)("border-ui-border-base border-b", className), ...props })));
Body.displayName = "Table.Body";
/**
 * This component is based on the `div` element and supports all of its props
 */
const Pagination = React.forwardRef(({ className, 
/**
 * The total number of items.
 */
count, 
/**
 * The number of items per page.
 */
pageSize, 
/**
 * The total number of pages.
 */
pageCount, 
/**
 * The current page index.
 */
pageIndex, 
/**
 * Whether there's a previous page that can be navigated to.
 */
canPreviousPage, 
/**
 * Whether there's a next page that can be navigated to.
 */
canNextPage, 
/**
 * A function that handles navigating to the next page.
 * This function should handle retrieving data for the next page.
 */
nextPage, 
/**
 * A function that handles navigating to the previous page.
 * This function should handle retrieving data for the previous page.
 */
previousPage, 
/**
 * An optional object of words to use in the pagination component.
 * Use this to override the default words, or translate them into another language.
 */
translations = {
    of: "of",
    results: "results",
    pages: "pages",
    prev: "Prev",
    next: "Next",
}, ...props }, ref) => {
    const { from, to } = React.useMemo(() => {
        const from = count === 0 ? count : pageIndex * pageSize + 1;
        const to = Math.min(count, (pageIndex + 1) * pageSize);
        return { from, to };
    }, [count, pageIndex, pageSize]);
    return (React.createElement("div", { ref: ref, className: (0, clx_1.clx)("text-ui-fg-subtle txt-compact-small-plus flex w-full items-center justify-between px-3 py-4", className), ...props },
        React.createElement("div", { className: "inline-flex items-center gap-x-1 px-3 py-[5px]" },
            React.createElement("p", null, from),
            React.createElement(icons_1.Minus, { className: "text-ui-fg-muted" }),
            React.createElement("p", null, `${to} ${translations.of} ${count} ${translations.results}`)),
        React.createElement("div", { className: "flex items-center gap-x-2" },
            React.createElement("div", { className: "inline-flex items-center gap-x-1 px-3 py-[5px]" },
                React.createElement("p", null,
                    pageIndex + 1,
                    " ",
                    translations.of,
                    " ",
                    Math.max(pageCount, 1),
                    " ",
                    translations.pages)),
            React.createElement(button_1.Button, { type: "button", variant: "transparent", onClick: previousPage, disabled: !canPreviousPage }, translations.prev),
            React.createElement(button_1.Button, { type: "button", variant: "transparent", onClick: nextPage, disabled: !canNextPage }, translations.next))));
});
Pagination.displayName = "Table.Pagination";
const Table = Object.assign(Root, {
    Row,
    Cell,
    Header,
    HeaderCell,
    Body,
    Pagination,
});
exports.Table = Table;
//# sourceMappingURL=table.js.map
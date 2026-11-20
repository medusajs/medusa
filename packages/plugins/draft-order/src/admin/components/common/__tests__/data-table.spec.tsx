import { createDataTableColumnHelper, TooltipProvider } from "@medusajs/ui"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"

import { DataTable } from "../data-table"

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => `t(${key})` }),
}))

type Row = { id: string; name: string }

const columnHelper = createDataTableColumnHelper<Row>()

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: true,
  }),
]

const render = () =>
  renderToStaticMarkup(
    <MemoryRouter>
      <TooltipProvider>
        <DataTable
          data={[{ id: "row_1", name: "Row 1" }]}
          columns={columns}
          getRowId={(row) => row.id}
          rowCount={40}
          pageSize={20}
        />
      </TooltipProvider>
    </MemoryRouter>
  )

describe("DataTable", () => {
  it("should render the search placeholder in the admin language", () => {
    const html = render()

    expect(html).toContain('placeholder="t(filters.searchLabel)"')
    expect(html).not.toContain('placeholder="Search"')
  })

  it("should render the pagination labels in the admin language", () => {
    const html = render()

    expect(html).toContain("t(general.prev)")
    expect(html).toContain("t(general.next)")
    expect(html).toContain("t(general.results)")
    expect(html).not.toMatch(/>Prev</)
    expect(html).not.toMatch(/>Next</)
  })
})

// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const useCountryTableQueryMock = vi.fn()

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/icons", () => ({
  PlusMini: () => <span />,
  Trash: () => <span />,
}))

vi.mock("@medusajs/ui", () => ({
  Checkbox: () => null,
  Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Heading: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  usePrompt: () => vi.fn(),
}))

vi.mock("../../../../../components/common/action-menu", () => ({
  ActionMenu: () => null,
}))

vi.mock("../../../../../components/table/data-table", () => ({
  _DataTable: ({ table }: { table: { options: { data: Array<{ display_name: string; iso_2: string }> } } }) => (
    <div data-testid="rows">
      {table.options.data
        .map((country) => `${country.display_name}:${country.iso_2}`)
        .join("|")}
    </div>
  ),
}))

vi.mock("../../../../../hooks/api/regions", () => ({
  useUpdateRegion: () => ({
    mutateAsync: vi.fn(),
  }),
}))

vi.mock("../../../../../hooks/use-data-table", () => ({
  useDataTable: ({
    data,
    meta,
  }: {
    data: Array<{ display_name: string; iso_2: string }>
    meta: unknown
  }) => ({
    table: {
      options: {
        data,
        meta,
      },
    },
  }),
}))

vi.mock("../../../common/hooks/use-country-table-query", () => ({
  useCountryTableQuery: () => useCountryTableQueryMock(),
}))

import { RegionCountrySection } from "./region-country-section"

const region = {
  id: "reg_123",
  countries: [
    {
      name: "Brazil",
      display_name: "Brazil",
      iso_2: "br",
      iso_3: "bra",
      num_code: "076",
    },
    {
      name: "Argentina",
      display_name: "Argentina",
      iso_2: "ar",
      iso_3: "arg",
      num_code: "032",
    },
  ],
}

describe("RegionCountrySection", () => {
  beforeEach(() => {
    useCountryTableQueryMock.mockReset()
  })

  afterEach(() => {
    cleanup()
  })

  it("passes countries sorted by display_name to the table", () => {
    useCountryTableQueryMock.mockReturnValue({
      searchParams: {
        limit: 10,
        offset: 0,
        order: "display_name",
        q: undefined,
      },
      raw: {},
    })

    render(<RegionCountrySection region={region as any} />)

    expect(screen.getByTestId("rows").textContent).toBe("Argentina:ar|Brazil:br")
  })

  it("passes countries sorted by iso_2 descending to the table", () => {
    useCountryTableQueryMock.mockReturnValue({
      searchParams: {
        limit: 10,
        offset: 0,
        order: "-iso_2",
        q: undefined,
      },
      raw: {},
    })

    render(<RegionCountrySection region={region as any} />)

    expect(screen.getByTestId("rows").textContent).toBe("Brazil:br|Argentina:ar")
  })
})

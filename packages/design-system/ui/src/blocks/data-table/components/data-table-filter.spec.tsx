// Saved first so that it can be restored: a reused vitest worker would otherwise
// carry Asia/Bangkok into later files.
const ORIGINAL_TZ = process.env.TZ
process.env.TZ = "Asia/Bangkok"

import { act, fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import { DataTable } from "@/blocks/data-table/data-table"
import { DataTableDateFilterProps } from "@/blocks/data-table/types"
import { useDataTable } from "@/blocks/data-table/use-data-table"
import { createDataTableColumnHelper } from "@/blocks/data-table/utils/create-data-table-column-helper"
import { createDataTableFilterHelper } from "@/blocks/data-table/utils/create-data-table-filter-helper"

type Row = { id: string; created_at: string }

const columnHelper = createDataTableColumnHelper<Row>()
const filterHelper = createDataTableFilterHelper<Row>()
const columns = [columnHelper.accessor("id", { header: "ID" })]

const DATE_FILTER: DataTableDateFilterProps = {
  type: "date",
  label: "Created At",
  options: [],
}

// Midnight of Oct 2 in Asia/Bangkok (UTC+7), and the last millisecond of it.
const OCT_2_START = "2026-10-01T17:00:00.000Z"
const OCT_2_END = "2026-10-02T16:59:59.999Z"
const OCT_2 = "Friday, October 2, 2026"

type RenderTableOptions = {
  filter?: DataTableDateFilterProps
  // The filter value as it sits in the parent state when the table mounts.
  initial?: unknown
  // React Router 7 commits `setSearchParams` inside `React.startTransition`,
  // so the parent state can lag behind the filter bar's local state.
  transition?: boolean
}

/**
 * Renders a table whose filter state lives in a serialised "URL", the way the
 * Admin keeps it. `urlWrites` records every value written for `created_at`
 * (`undefined` when the filter was removed).
 */
function renderTable({
  filter = DATE_FILTER,
  initial,
  transition = true,
}: RenderTableOptions = {}) {
  const urlWrites: (string | undefined)[] = []

  const Table = () => {
    const [url, setUrl] = React.useState<Record<string, string>>(
      initial === undefined ? {} : { created_at: JSON.stringify(initial) }
    )
    const filters = React.useMemo(
      () => [filterHelper.accessor("created_at", filter)],
      []
    )

    const instance = useDataTable({
      data: [],
      columns,
      filters,
      getRowId: (row) => row.id,
      rowCount: 0,
      filtering: {
        state: Object.fromEntries(
          Object.entries(url).map(([key, value]) => [key, JSON.parse(value)])
        ),
        onFilteringChange: (state) => {
          const next: Record<string, string> = {}
          Object.entries(state).forEach(([key, value]) => {
            if (value !== undefined) {
              next[key] = JSON.stringify(value)
            }
          })
          urlWrites.push(next.created_at)

          if (transition) {
            React.startTransition(() => setUrl(next))
          } else {
            setUrl(next)
          }
        },
      },
    })

    return (
      <DataTable instance={instance}>
        <DataTable.Toolbar>
          <span />
        </DataTable.Toolbar>
        <output data-testid="url">{url.created_at ?? ""}</output>
        {/* A change that does not come from the filter bar, e.g. a view switch */}
        <button
          type="button"
          onClick={() =>
            React.startTransition(() =>
              setUrl({
                created_at: JSON.stringify({
                  $gte: "2026-09-14T17:00:00.000Z",
                }),
              })
            )
          }
        >
          external change
        </button>
      </DataTable>
    )
  }

  render(<Table />)

  return {
    user: userEvent.setup({ delay: null }),
    urlWrites,
    getUrlValue: () => {
      const value = screen.getByTestId("url").textContent
      return value ? JSON.parse(value) : undefined
    },
  }
}

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

type User = ReturnType<typeof userEvent.setup>
type Picker = "Starting" | "Ending"

// Radix positions the popover with layout measurements that jsdom does not
// have and leaves it `visibility: hidden`, which empties the accessible names
// inside it. Find the pickers by their visible label and `aria-label` instead.
const getPicker = (picker: Picker) =>
  within(screen.getByText(picker).parentElement!)

async function pickDay(user: User, picker: Picker, day: string) {
  await user.click(getPicker(picker).getByLabelText("Calendar"))
  await settle()
  await user.click(screen.getByLabelText(new RegExp(day)))
  await settle()
}

async function clearPicker(user: User, picker: Picker) {
  await user.click(getPicker(picker).getByLabelText("Clear date"))
  await settle()
}

afterAll(() => {
  if (ORIGINAL_TZ === undefined) {
    delete process.env.TZ
  } else {
    process.env.TZ = ORIGINAL_TZ
  }
})

// Each case opens the filter and drives react-aria calendars, which can exceed
// the 5s default on a busy CI runner.
describe("DataTable date filter", { timeout: 20_000 }, () => {
  beforeEach(() => {
    // 12:00 on Oct 2 in Asia/Bangkok, so "today" in the calendar is Oct 2.
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date("2026-10-02T05:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("runs in Asia/Bangkok", () => {
    expect(new Date(2026, 9, 2).toISOString()).toBe(OCT_2_START)
  })

  describe("custom range", () => {
    it.each([true, false])(
      "includes the whole of the last day, in Asia/Bangkok (transition: %s)",
      async (transition) => {
        const { user, urlWrites, getUrlValue } = renderTable({
          transition,
          initial: null,
        })

        await user.click(screen.getByText("Custom"))
        await pickDay(user, "Starting", OCT_2)
        expect(screen.getByText("Starting")).toBeInTheDocument()

        await pickDay(user, "Ending", OCT_2)

        expect(getUrlValue()).toEqual({ $gte: OCT_2_START, $lte: OCT_2_END })
        // The picker re-emitting a stale value must not leave an empty
        // filter behind, which would make the chip impossible to reopen.
        expect(urlWrites).not.toContain("{}")
        // The popover stays open for the next edit.
        expect(screen.getByText("Ending")).toBeInTheDocument()
      }
    )

    it("keeps the picked instant for the upper bound with the date-time format", async () => {
      const { user, getUrlValue } = renderTable({
        filter: { ...DATE_FILTER, format: "date-time" },
        initial: null,
      })

      await user.click(screen.getByText("Custom"))
      await pickDay(user, "Starting", OCT_2)
      await pickDay(user, "Ending", OCT_2)

      expect(getUrlValue()).toEqual({ $gte: OCT_2_START, $lte: OCT_2_START })
    })

    it("removes the filter when its only bound is cleared", async () => {
      const { user, urlWrites } = renderTable({
        initial: { $gte: OCT_2_START },
      })

      await user.click(screen.getByRole("button", { name: /Starting/ }))
      await settle()
      await clearPicker(user, "Starting")

      expect(urlWrites).not.toContain("{}")
      expect(screen.getByTestId("url")).toHaveTextContent("")
    })

    it("keeps the other bound when one of two is cleared", async () => {
      const { user, getUrlValue } = renderTable({
        initial: { $gte: OCT_2_START, $lte: OCT_2_END },
      })

      await user.click(screen.getByRole("button", { name: /Oct 2, 2026/ }))
      await settle()
      await clearPicker(user, "Starting")

      expect(getUrlValue()).toEqual({ $lte: OCT_2_END })
    })
  })

  describe("options", () => {
    it("passes a preset option's value through untouched", async () => {
      const preset = {
        $gte: "2026-09-01T00:00:00.000Z",
        $lte: "2026-09-30T00:00:00.000Z",
      }
      const { user, getUrlValue } = renderTable({
        filter: {
          ...DATE_FILTER,
          options: [{ label: "September", value: preset }],
        },
        initial: null,
      })

      await user.click(screen.getByText("September"))
      await settle()

      expect(getUrlValue()).toEqual(preset)
    })
  })

  describe("sync with the parent state", () => {
    it("lets a later parent change replace a local edit", async () => {
      const { user, getUrlValue } = renderTable({ initial: null })

      await user.click(screen.getByText("Custom"))
      await pickDay(user, "Starting", OCT_2)
      expect(getUrlValue()).toEqual({ $gte: OCT_2_START })

      fireEvent.click(screen.getByText("external change"))
      await settle()

      expect(getUrlValue()).toEqual({ $gte: "2026-09-14T17:00:00.000Z" })
      // The chip follows the parent.
      expect(screen.getByText(/Starting Sep 15, 2026/)).toBeInTheDocument()
    })
  })
})

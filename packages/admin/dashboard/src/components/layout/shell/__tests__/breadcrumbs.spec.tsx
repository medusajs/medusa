// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react"
import {
  Link,
  Outlet,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom"
import { afterEach, describe, expect, it } from "vitest"

import { Breadcrumbs } from "../shell"

const createRouter = (initialEntry: string) =>
  createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <>
            <Breadcrumbs />
            <Outlet />
          </>
        ),
        children: [
          {
            path: "orders",
            handle: { breadcrumb: () => "Orders" },
            children: [
              {
                path: "",
                element: <Link to="/orders/order_1">Open order</Link>,
              },
              {
                path: ":id",
                handle: { breadcrumb: () => "#1" },
                element: <div>Order details</div>,
              },
            ],
          },
        ],
      },
    ],
    { initialEntries: [initialEntry] }
  )

describe("Breadcrumbs", () => {
  afterEach(() => {
    cleanup()
  })

  it("should link back to the list with the search params it was left with", async () => {
    const listSearch =
      "?created_at=%7B%22%24gte%22%3A%222024-01-01%22%7D&offset=40&q=foo"
    const router = createRouter(`/orders${listSearch}`)

    render(<RouterProvider router={router} />)

    await act(async () => {
      await router.navigate("/orders/order_1")
    })

    expect(screen.getByText("Order details")).toBeTruthy()
    expect(
      screen.getByRole("link", { name: "Orders" }).getAttribute("href")
    ).toBe(`/orders${listSearch}`)
  })

  it("should link to the plain list path when the list was opened without search params", async () => {
    const router = createRouter("/orders")

    render(<RouterProvider router={router} />)

    await act(async () => {
      await router.navigate("/orders/order_1")
    })

    expect(
      screen.getByRole("link", { name: "Orders" }).getAttribute("href")
    ).toBe("/orders")
  })
})

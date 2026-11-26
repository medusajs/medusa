import { FetchError } from "@medusajs/js-sdk"
import { describe, expect, it, vi } from "vitest"

import { auditModuleLoader } from "../audit-module-loader"

const mocks = vi.hoisted(() => ({
  modules: [] as { key: string }[],
}))

vi.mock("../../../../lib/client", () => ({
  sdk: { admin: { module: { list: vi.fn() } } },
}))

vi.mock("../../../../lib/query-client", () => ({
  queryClient: {
    ensureQueryData: async () => ({ modules: mocks.modules }),
  },
}))

describe("auditModuleLoader", () => {
  it("resolves when the audit module is installed", async () => {
    mocks.modules = [{ key: "audit" }]

    await expect(auditModuleLoader()).resolves.toBeNull()
  })

  it("throws a 404 when the audit module is not installed", async () => {
    mocks.modules = [{ key: "rbac" }]

    const error = await auditModuleLoader().catch((e) => e)

    expect(error).toBeInstanceOf(FetchError)
    expect(error.status).toBe(404)
  })
})

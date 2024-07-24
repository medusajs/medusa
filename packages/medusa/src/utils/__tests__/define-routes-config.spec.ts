import zod from "zod"
import { defineRoutesConfig } from "../define-routes-config"
import { MedusaRequest, MedusaResponse } from "../../types/routing"

describe("defineRoutesConfig", function () {
  test("define custom middleware for a route", () => {
    const config = defineRoutesConfig([
      {
        matcher: "/admin/products",
        middlewares: [() => {}],
      },
    ])

    expect(config).toMatchObject({
      routes: [
        {
          matcher: "/admin/products",
          middlewares: [expect.any(Function)],
        },
      ],
    })
  })

  test("should wrap body extendedValidator to middleware", () => {
    const req = {
      body: {},
    } as MedusaRequest
    const res = {} as MedusaResponse
    const nextFn = jest.fn()
    const schema = zod.object({
      brand_id: zod.string(),
    })

    const config = defineRoutesConfig([
      {
        matcher: "/admin/products",
        extendedValidators: {
          body: schema,
        },
      },
    ])

    expect(config).toMatchObject({
      routes: [
        {
          matcher: "/admin/products",
          middlewares: [expect.any(Function)],
        },
      ],
    })

    config.routes?.[0].middlewares?.[0](req, res, nextFn)
    expect(req.extendedValidators).toMatchObject({
      body: schema,
    })
  })

  test("should wrap queryParams extendedValidator to middleware", () => {
    const req = {
      body: {},
    } as MedusaRequest
    const res = {} as MedusaResponse
    const nextFn = jest.fn()
    const schema = zod.object({
      brand_id: zod.string(),
    })

    const config = defineRoutesConfig([
      {
        matcher: "/admin/products",
        extendedValidators: {
          queryParams: schema,
        },
      },
    ])

    expect(config).toMatchObject({
      routes: [
        {
          matcher: "/admin/products",
          middlewares: [expect.any(Function)],
        },
      ],
    })

    config.routes?.[0].middlewares?.[0](req, res, nextFn)
    expect(req.extendedValidators).toMatchObject({
      queryParams: schema,
    })
  })
})

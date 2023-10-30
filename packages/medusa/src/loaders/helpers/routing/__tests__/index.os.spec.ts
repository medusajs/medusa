import express from "express"
import http from "http"
import { resolve } from "path"
import request from "supertest"
import { mockConfigModule } from "../__fixtures__/mocks"
import { RoutesLoader } from "../index"

describe("Test OS compatibility of RouteLoader", function () {
  afterEach(function () {
    jest.clearAllMocks()
  })

  describe("Routes", function () {
    const app = express()
    const server = http.createServer(app)

    beforeAll(async function () {
      const rootDir = resolve(__dirname, "../__fixtures__/routers")

      await new RoutesLoader({
        app,
        rootDir,
        configModule: mockConfigModule,
      }).load()
    })

    it("should return a status 200 on GET admin/order/:id", async function () {
      await request(server)
        .get("/admin/orders/1000")
        .expect(200)
        .expect("GET order 1000")
    })
  })
})

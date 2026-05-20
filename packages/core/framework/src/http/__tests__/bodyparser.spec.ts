import express from "express"
import supertest from "supertest"
import { createBodyParserMiddlewaresStack } from "../middlewares/bodyparser"
import type { BodyParserConfigRoute } from "../types"
import type { RoutesFinder } from "../routes-finder"

function createMockRoutesFinder(
  config: BodyParserConfigRoute["config"]
): RoutesFinder<BodyParserConfigRoute> {
  return {
    find: () => ({
      matcher: "/webhook",
      methods: "POST",
      config,
    }),
  } as unknown as RoutesFinder<BodyParserConfigRoute>
}

function createTestApp(routesFinder: RoutesFinder<BodyParserConfigRoute>) {
  const app = express()

  const stack = createBodyParserMiddlewaresStack("/webhook", routesFinder)
  stack.forEach((mw) => app.use(mw))

  app.post("/webhook", (req: any, res) => {
    res.json({
      body: req.body,
      hasRawBody: !!req.rawBody,
      rawBodyString: req.rawBody ? req.rawBody.toString("utf-8") : null,
    })
  })

  return supertest(app)
}

describe("bodyparser preserveRawBody", () => {
  describe("with preserveRawBody: true", () => {
    let request: supertest.Agent

    beforeAll(() => {
      const finder = createMockRoutesFinder({ preserveRawBody: true })
      request = createTestApp(finder)
    })

    it("preserves rawBody for application/json", async () => {
      const payload = { event: "payment.completed" }

      const res = await request
        .post("/webhook")
        .set("Content-Type", "application/json")
        .send(JSON.stringify(payload))
        .expect(200)

      expect(res.body.hasRawBody).toBe(true)
      expect(res.body.rawBodyString).toBe(JSON.stringify(payload))
    })

    it("preserves rawBody for text/plain", async () => {
      const payload = "raw webhook payload"

      const res = await request
        .post("/webhook")
        .set("Content-Type", "text/plain")
        .send(payload)
        .expect(200)

      expect(res.body.hasRawBody).toBe(true)
      expect(res.body.rawBodyString).toBe(payload)
    })

    it("preserves rawBody for application/x-www-form-urlencoded", async () => {
      const res = await request
        .post("/webhook")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("event=payment.completed&amount=1000")
        .expect(200)

      expect(res.body.hasRawBody).toBe(true)
      expect(res.body.rawBodyString).toBe(
        "event=payment.completed&amount=1000"
      )
    })
  })

  describe("without preserveRawBody", () => {
    let request: supertest.Agent

    beforeAll(() => {
      const finder = createMockRoutesFinder({})
      request = createTestApp(finder)
    })

    it("does not set rawBody for application/json", async () => {
      const res = await request
        .post("/webhook")
        .set("Content-Type", "application/json")
        .send(JSON.stringify({ test: true }))
        .expect(200)

      expect(res.body.hasRawBody).toBe(false)
    })

    it("does not set rawBody for text/plain", async () => {
      const res = await request
        .post("/webhook")
        .set("Content-Type", "text/plain")
        .send("hello")
        .expect(200)

      expect(res.body.hasRawBody).toBe(false)
    })

    it("does not set rawBody for application/x-www-form-urlencoded", async () => {
      const res = await request
        .post("/webhook")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("key=value")
        .expect(200)

      expect(res.body.hasRawBody).toBe(false)
    })
  })
})

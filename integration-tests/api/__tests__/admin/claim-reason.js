const { match } = require("assert")
const path = require("path")
const { RepositoryNotTreeError } = require("typeorm")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/claim-reasons", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /admin/claim-reasons", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a claim_reason", async () => {
      const api = useApi()

      const payload = {
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const response = await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.claim_reason).toMatchSnapshot({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        parent_claim_reason: null,
        parent_claim_reason_id: null,
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      })
    })

    it("creates a nested claim reason", async () => {
      const api = useApi()

      const payload = {
        label: "Wrong size",
        description: "Use this if the size was too big",
        value: "wrong_size",
      }

      const response = await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.claim_reason).toEqual(
        expect.objectContaining({
          label: "Wrong size",
          description: "Use this if the size was too big",
          value: "wrong_size",
        })
      )

      const nested_payload = {
        parent_claim_reason_id: response.data.claim_reason.id,
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const nested_response = await api
        .post("/admin/claim-reasons", nested_payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(nested_response.status).toEqual(200)

      expect(nested_response.data.claim_reason).toEqual(
        expect.objectContaining({
          parent_claim_reason_id: response.data.claim_reason.id,

          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      )
    })

    it("fails to create a doubly nested claim reason", async () => {
      expect.assertions(5)

      const api = useApi()

      const payload = {
        label: "Wrong size",
        description: "Use this if the size was too big",
        value: "wrong_size",
      }

      const response = await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.claim_reason).toEqual(
        expect.objectContaining({
          label: "Wrong size",
          description: "Use this if the size was too big",
          value: "wrong_size",
        })
      )

      const nested_payload = {
        parent_claim_reason_id: response.data.claim_reason.id,
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const nested_response = await api
        .post("/admin/claim-reasons", nested_payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const dbl_nested_payload = {
        parent_claim_reason_id: nested_response.data.claim_reason.id,
        label: "Too large size",
        description: "Use this if the size was too big",
        value: "large_size",
      }

      const dbl_nested_response = await api
        .post("/admin/claim-reasons", dbl_nested_payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("invalid_data")
          expect(err.response.data.message).toEqual(
            "Doubly nested claim reasons is not supported"
          )
        })
    })

    it("deletes a claim_reason", async () => {
      const api = useApi()

      const payload = {
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const response = await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.claim_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      )

      const deleteResponse = await api
        .delete(`/admin/claim-reasons/${response.data.claim_reason.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(deleteResponse.data).toEqual(
        expect.objectContaining({
          id: response.data.claim_reason.id,
          object: "claim_reason",
          deleted: true,
        })
      )
    })

    it("update a claim reason", async () => {
      const api = useApi()

      const payload = {
        label: "Too Big Typo",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const response = await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.claim_reason).toEqual(
        expect.objectContaining({
          label: "Too Big Typo",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      )

      const newResponse = await api
        .post(
          `/admin/claim-reasons/${response.data.claim_reason.id}`,
          {
            label: "Too Big",
            description: "new desc",
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      expect(newResponse.data.claim_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "new desc",
          value: "too_big",
        })
      )
    })

    it("lists nested claim reasons", async () => {
      const api = useApi()

      const payload = {
        label: "Wrong size",
        description: "Use this if the size was too big",
        value: "wrong_size",
      }

      const response = await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const nested_payload = {
        parent_claim_reason_id: response.data.claim_reason.id,
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const resp = await api
        .post("/admin/claim-reasons", nested_payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const nested_response = await api
        .get("/admin/claim-reasons", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(nested_response.status).toEqual(200)

      expect(nested_response.data.claim_reasons).toEqual([
        expect.objectContaining({
          label: "Wrong size",
          description: "Use this if the size was too big",
          value: "wrong_size",
          claim_reason_children: expect.arrayContaining([
            expect.objectContaining({
              label: "Too Big",
              description: "Use this if the size was too big",
              value: "too_big",
            }),
          ]),
        }),
      ])
    })

    it("list claim reasons", async () => {
      const api = useApi()

      const payload = {
        label: "Too Big Typo",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const response = await api
        .get("/admin/claim-reasons", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.claim_reasons).toEqual([
        expect.objectContaining({
          value: "too_big",
        }),
      ])
    })
  })

  describe("DELETE /admin/claim-reasons", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("deletes single claim reason", async () => {
      expect.assertions(6)

      const api = useApi()

      const payload = {
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const response = await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.claim_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      )

      const deleteResult = await api.delete(
        `/admin/claim-reasons/${response.data.claim_reason.id}`,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      expect(deleteResult.status).toEqual(200)

      expect(deleteResult.data).toEqual({
        id: response.data.claim_reason.id,
        object: "claim_reason",
        deleted: true,
      })

      const getResult = await api
        .get(`/admin/claim-reasons/${response.data.claim_reason.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(404)
          expect(err.response.data.type).toEqual("not_found")
        })
    })

    it("deletes cascade through nested claim reasons", async () => {
      expect.assertions(10)

      const api = useApi()

      const payload = {
        label: "Wrong Size",
        description: "Use this if the size was wrong",
        value: "wrong_size",
      }

      const response = await api
        .post("/admin/claim-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.claim_reason).toEqual(
        expect.objectContaining({
          label: "Wrong Size",
          description: "Use this if the size was wrong",
          value: "wrong_size",
        })
      )

      const payload_child = {
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
        parent_claim_reason_id: response.data.claim_reason.id,
      }

      const response_child = await api
        .post("/admin/claim-reasons", payload_child, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response_child.status).toEqual(200)

      expect(response_child.data.claim_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
          parent_claim_reason_id: response.data.claim_reason.id,
        })
      )

      const deleteResult = await api
        .delete(`/admin/claim-reasons/${response.data.claim_reason.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err.response.data)
        })

      expect(deleteResult.status).toEqual(200)

      expect(deleteResult.data).toEqual({
        id: response.data.claim_reason.id,
        object: "claim_reason",
        deleted: true,
      })

      await api
        .get(`/admin/claim-reasons/${response.data.claim_reason.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(404)
          expect(err.response.data.type).toEqual("not_found")
        })

      await api
        .get(`/admin/claim-reasons/${response_child.data.claim_reason.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(404)
          expect(err.response.data.type).toEqual("not_found")
        })
    })
  })
})

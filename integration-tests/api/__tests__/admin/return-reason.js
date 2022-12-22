const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/return-reasons", () => {
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

  describe("POST /admin/return-reasons", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a return_reason", async () => {
      const api = useApi()

      const payload = {
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.return_reason).toMatchSnapshot({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        parent_return_reason: null,
        parent_return_reason_id: null,
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      })
    })

    it("creates a nested return reason", async () => {
      const api = useApi()

      const payload = {
        label: "Wrong size",
        description: "Use this if the size was too big",
        value: "wrong_size",
      }

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Wrong size",
          description: "Use this if the size was too big",
          value: "wrong_size",
        })
      )

      const nested_payload = {
        parent_return_reason_id: response.data.return_reason.id,
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const nested_response = await api
        .post("/admin/return-reasons", nested_payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(nested_response.status).toEqual(200)

      expect(nested_response.data.return_reason).toEqual(
        expect.objectContaining({
          parent_return_reason_id: response.data.return_reason.id,

          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      )
    })

    it("fails to create a doubly nested return reason", async () => {
      expect.assertions(5)

      const api = useApi()

      const payload = {
        label: "Wrong size",
        description: "Use this if the size was too big",
        value: "wrong_size",
      }

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Wrong size",
          description: "Use this if the size was too big",
          value: "wrong_size",
        })
      )

      const nested_payload = {
        parent_return_reason_id: response.data.return_reason.id,
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const nested_response = await api
        .post("/admin/return-reasons", nested_payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const dbl_nested_payload = {
        parent_return_reason_id: nested_response.data.return_reason.id,
        label: "Too large size",
        description: "Use this if the size was too big",
        value: "large_size",
      }

      const dbl_nested_response = await api
        .post("/admin/return-reasons", dbl_nested_payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("invalid_data")
          expect(err.response.data.message).toEqual(
            "Doubly nested return reasons is not supported"
          )
        })
    })

    it("deletes a return_reason", async () => {
      const api = useApi()

      const payload = {
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      )

      const deleteResponse = await api
        .delete(`/admin/return-reasons/${response.data.return_reason.id}`, {
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
          id: response.data.return_reason.id,
          object: "return_reason",
          deleted: true,
        })
      )
    })

    it("update a return reason", async () => {
      const api = useApi()

      const payload = {
        label: "Too Big Typo",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Too Big Typo",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      )

      const newResponse = await api
        .post(
          `/admin/return-reasons/${response.data.return_reason.id}`,
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

      expect(newResponse.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "new desc",
          value: "too_big",
        })
      )
    })

    it("lists nested return reasons", async () => {
      const api = useApi()

      const payload = {
        label: "Wrong size",
        description: "Use this if the size was too big",
        value: "wrong_size",
      }

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const nested_payload = {
        parent_return_reason_id: response.data.return_reason.id,
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const resp = await api
        .post("/admin/return-reasons", nested_payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const nested_response = await api
        .get("/admin/return-reasons", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(nested_response.status).toEqual(200)

      expect(nested_response.data.return_reasons).toHaveLength(1)
      expect(nested_response.data.return_reasons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            label: "Wrong size",
            description: "Use this if the size was too big",
            value: "wrong_size",
            return_reason_children: expect.arrayContaining([
              expect.objectContaining({
                label: "Too Big",
                description: "Use this if the size was too big",
                value: "too_big",
              }),
            ]),
          }),
        ])
      )
    })

    it("list return reasons", async () => {
      const api = useApi()

      const payload = {
        label: "Too Big Typo",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      const response = await api
        .get("/admin/return-reasons", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.return_reasons).toHaveLength(1)
      expect(response.data.return_reasons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            value: "too_big",
          }),
        ])
      )
    })
  })

  describe("DELETE /admin/return-reasons", () => {
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

    it("deletes single return reason", async () => {
      expect.assertions(6)

      const api = useApi()

      const payload = {
        label: "Too Big",
        description: "Use this if the size was too big",
        value: "too_big",
      }

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
        })
      )

      const deleteResult = await api.delete(
        `/admin/return-reasons/${response.data.return_reason.id}`,
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      expect(deleteResult.status).toEqual(200)

      expect(deleteResult.data).toEqual({
        id: response.data.return_reason.id,
        object: "return_reason",
        deleted: true,
      })

      const getResult = await api
        .get(`/admin/return-reasons/${response.data.return_reason.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(404)
          expect(err.response.data.type).toEqual("not_found")
        })
    })

    it("deletes cascade through nested return reasons", async () => {
      expect.assertions(10)

      const api = useApi()

      const payload = {
        label: "Wrong Size",
        description: "Use this if the size was wrong",
        value: "wrong_size",
      }

      const response = await api
        .post("/admin/return-reasons", payload, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.return_reason).toEqual(
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
        parent_return_reason_id: response.data.return_reason.id,
      }

      const response_child = await api
        .post("/admin/return-reasons", payload_child, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response_child.status).toEqual(200)

      expect(response_child.data.return_reason).toEqual(
        expect.objectContaining({
          label: "Too Big",
          description: "Use this if the size was too big",
          value: "too_big",
          parent_return_reason_id: response.data.return_reason.id,
        })
      )

      const deleteResult = await api
        .delete(`/admin/return-reasons/${response.data.return_reason.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err.response.data)
        })

      expect(deleteResult.status).toEqual(200)

      expect(deleteResult.data).toEqual({
        id: response.data.return_reason.id,
        object: "return_reason",
        deleted: true,
      })

      await api
        .get(`/admin/return-reasons/${response.data.return_reason.id}`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(404)
          expect(err.response.data.type).toEqual("not_found")
        })

      await api
        .get(`/admin/return-reasons/${response_child.data.return_reason.id}`, {
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

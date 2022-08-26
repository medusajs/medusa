const path = require("path")
const { Note } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

const note = {
  id: "note1",
  value: "note text",
  resource_id: "resource1",
  resource_type: "type",
  author: { id: "admin_user" },
}

describe("/admin/notes", () => {
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

  describe("GET /admin/notes/:id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager

      await adminSeeder(dbConnection)

      await manager.insert(Note, note)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("properly retrieves note", async () => {
      const api = useApi()

      const response = await api.get("/admin/notes/note1", {
        headers: {
          authorization: "Bearer test_token",
        },
      })

      expect(response.data).toMatchObject({
        note: {
          id: "note1",
          resource_id: "resource1",
          resource_type: "type",
          value: "note text",
          author: { id: "admin_user" },
        },
      })
    })
  })

  describe("POST /admin/notes", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a note", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/notes",
          {
            resource_id: "resource-id",
            resource_type: "resource-type",
            value: "my note",
          },
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.data).toMatchObject({
        note: {
          id: expect.stringMatching(/^note_*/),
          resource_id: "resource-id",
          resource_type: "resource-type",
          value: "my note",
          author_id: "admin_user",
        },
      })
    })
  })

  describe("GET /admin/notes", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager

      await adminSeeder(dbConnection)

      await manager.insert(Note, { ...note, id: "note1" })
      await manager.insert(Note, { ...note, id: "note2" })
      await manager.insert(Note, {
        ...note,
        id: "note3",
        resource_id: "resource2",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists notes only related to wanted resource", async () => {
      const api = useApi()
      const response = await api
        .get("/admin/notes?resource_id=resource1", {
          headers: {
            authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.notes.length).toEqual(2)
      expect(response.data).toMatchObject({
        notes: [
          {
            id: "note1",
            resource_id: "resource1",
            resource_type: "type",
            value: "note text",
            author: { id: "admin_user" },
          },
          {
            id: "note2",
            resource_id: "resource1",
            resource_type: "type",
            value: "note text",
            author: { id: "admin_user" },
          },
        ],
      })
    })
  })

  describe("POST /admin/notes/:id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager

      await adminSeeder(dbConnection)

      await manager.insert(Note, note)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates the content of the note", async () => {
      const api = useApi()

      await api
        .post(
          "/admin/notes/note1",
          { value: "new text" },
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      const response = await api
        .get("/admin/notes/note1", {
          headers: {
            authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.note.value).toEqual("new text")
    })
  })

  describe("DELETE /admin/notes/:id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager

      await adminSeeder(dbConnection)

      await manager.insert(Note, note)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("deletes the wanted note", async () => {
      const api = useApi()

      await api
        .delete("/admin/notes/note1", {
          headers: {
            authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      let error
      await api
        .get("/admin/notes/note1", {
          headers: {
            authorization: "Bearer test_token",
          },
        })
        .catch((err) => (error = err))

      expect(error.response.status).toEqual(404)
    })
  })
})

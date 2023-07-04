const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const userSeeder = require("../../helpers/user-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/invites", () => {
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

  describe("GET /admin/users", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await userSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists invites", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/invites", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.invites).toMatchSnapshot([
        {
          id: "memberInvite",
          user_email: "invite-member@test.com",
          role: "member",
          accepted: false,
          token: expect.any(String),
          expires_at: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: "adminInvite",
          user_email: "invite-admin@test.com",
          role: "admin",
          accepted: false,
          token: expect.any(String),
          created_at: expect.any(String),
          expires_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ])
    })
  })

  describe("POST /admin/invites", () => {
    let user
    beforeEach(async () => {
      const api = useApi()
      await adminSeeder(dbConnection)
      await userSeeder(dbConnection)

      const response = await api
        .post(
          "/admin/users",
          {
            email: "test@forgottenPassword.com",
            role: "member",
            password: "test123453",
          },
          {
            headers: { Authorization: "Bearer test_token" },
          }
        )
        .catch((err) => console.log(err))

      user = response.data.user
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    describe("Invitations", () => {
      it("create an invite with the specified emails and role", async () => {
        const api = useApi()

        const payload = {
          user: "test@medusa-commerce.com",
          role: "admin",
        }

        const createReponse = await api
          .post("/admin/invites", payload, {
            headers: { Authorization: "Bearer test_token" },
          })
          .catch((err) => console.log(err))

        const response = await api
          .get("/admin/invites", {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })

        expect(createReponse.status).toEqual(200)

        expect(response.data.invites).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ user_email: payload.user }),
          ])
        )

        expect(response.status).toEqual(200)
      })

      it("updates invite with new role", async () => {
        const api = useApi()

        const payload = {
          user: "invite-member@test.com",
          role: "admin",
        }

        const createReponse = await api
          .post("/admin/invites", payload, {
            headers: { Authorization: "Bearer test_token" },
          })
          .catch((err) => console.log(err))

        const response = await api
          .get("/admin/invites", {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })

        expect(createReponse.status).toEqual(200)

        expect(response.data.invites).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              user_email: payload.user,
              role: "admin",
            }),
          ])
        )

        expect(response.status).toEqual(200)
      })

      it("resends invite", async () => {
        const api = useApi()

        const id = "memberInvite"

        const resendResponse = await api
          .post(
            `/admin/invites/${id}/resend`,
            {},
            {
              headers: { Authorization: "Bearer test_token" },
            }
          )
          .catch((err) => console.log(err))

        expect(resendResponse.status).toEqual(200)
      })

      it("creates a user successfully when accepting an invite (unauthorized endpoint)", async () => {
        const api = useApi()

        const inviteResponse = await api.get("/admin/invites", {
          headers: { Authorization: "Bearer test_token" },
        })

        const { token, ...rest } = inviteResponse.data.invites[0]

        const user = {
          first_name: "test",
          last_name: "testesen",
          password: "supersecret",
        }

        const payload = { token, user }

        const createResponse = await api
          .post("/admin/invites/accept", payload)
          .catch((err) => console.log(err))

        const userResponse = await api.get("/admin/users", {
          headers: { Authorization: "Bearer test_token" },
        })

        const newUser = userResponse.data.users.find(
          (usr) => usr.email == rest.user_email
        )

        expect(newUser).toEqual(expect.objectContaining({ role: rest.role }))
        expect(createResponse.status).toEqual(200)
      })

      it("creates a user successfully with new role after updating invite (unauthorized endpoint)", async () => {
        const api = useApi()

        const inviteResponse = await api.get("/admin/invites", {
          headers: { Authorization: "Bearer test_token" },
        })

        const { token, ...rest } = inviteResponse.data.invites.find(
          (inv) => inv.role === "member"
        )

        const user = {
          first_name: "test",
          last_name: "testesen",
          password: "supersecret",
        }

        const updatePayload = {
          user: rest.user_email,
          role: "admin",
        }

        const updateResponse = await api
          .post("/admin/invites", updatePayload, {
            headers: { Authorization: "Bearer test_token" },
          })
          .catch((err) => console.log(err))

        const payload = { token, user }

        const createResponse = await api.post("/admin/invites/accept", payload)

        const userResponse = await api.get("/admin/users", {
          headers: { Authorization: "Bearer test_token" },
        })

        const newUser = userResponse.data.users.find(
          (usr) => usr.email == rest.user_email
        )

        expect(newUser).toEqual(expect.objectContaining({ role: "admin" }))
        expect(updateResponse.status).toEqual(200)
        expect(createResponse.status).toEqual(200)
      })
      it("Fails to accept an invite given an invalid token (unauthorized endpoint)", async () => {
        expect.assertions(2)
        const api = useApi()

        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnZpdGVfaWQiOiJpbnZpdGVfMDFGSFFWNlpBOERRRlgySjM3UVo5SjZTOTAiLCJyb2xlIjoiYWRtaW4iLCJ1c2VyX2VtYWlsIjoic2ZAc2RmLmNvbSIsImlhdCI6MTYzMzk2NDAyMCwiZXhwIjoxNjM0NTY4ODIwfQ.ZsmDvunBxhRW1iRqvfEfWixJLZ1zZVzaEYST38Vbl00"

        await api
          .post("/admin/invites/accept", {
            token,
            user: {
              first_name: "test",
              last_name: "testesen",
              password: "supersecret",
            },
          })
          .catch((err) => {
            expect(err.response.status).toEqual(400)
            expect(err.response.data.message).toEqual("Token is not valid")
          })
      })

      it("fails to accept an already accepted invite (unauthorized endpoint)", async () => {
        expect.assertions(4)

        const api = useApi()

        const inviteResponse = await api.get("/admin/invites", {
          headers: { Authorization: "Bearer test_token" },
        })

        const { token } = inviteResponse.data.invites[0]

        const user = {
          first_name: "test",
          last_name: "testesen",
          password: "supersecret",
        }

        const payload = { token, user }

        const createResponse = await api.post("/admin/invites/accept", payload)

        const secondPayload = {
          user: {
            first_name: "testesens",
            last_name: "test",
            password: "testesens",
          },
          token,
        }

        await api.post("/admin/invites/accept", secondPayload).catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual("Invalid invite")
          expect(err.response.data.type).toEqual("invalid_data")
        })
        expect(createResponse.status).toEqual(200)
      })
    })
  })

  describe("DELETE /admin/users", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await userSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })
    it("/admin/invites Deletes an invite", async () => {
      const api = useApi()

      const inviteId = "memberInvite"

      const invitesBeforeDeleteRequest = await api.get("/admin/invites", {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      const invitesBeforeDelete = invitesBeforeDeleteRequest.data.invites

      const response = await api
        .delete(`/admin/invites/${inviteId}`, {
          headers: { Authorization: "Bearer test_token" },
        })
        .catch((err) => console.log(err))

      const invitesAfterDeleteRequest = await api.get("/admin/invites", {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: inviteId,
        object: "invite",
        deleted: true,
      })

      const invitesAfterDelete = invitesAfterDeleteRequest.data.invites

      expect(invitesAfterDelete.length).toEqual(invitesBeforeDelete.length - 1)
      expect(invitesBeforeDelete).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: inviteId })])
      )

      expect(invitesAfterDelete).toEqual(
        expect.not.arrayContaining([expect.objectContaining({ id: inviteId })])
      )
    })
  })
})

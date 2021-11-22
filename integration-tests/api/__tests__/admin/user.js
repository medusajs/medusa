const jwt = require("jsonwebtoken")
const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const userSeeder = require("../../helpers/user-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/users", () => {
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

    it("returns user by id", async () => {
      const api = useApi()

      const response = await api.get("/admin/users/admin_user", {
        headers: { Authorization: "Bearer test_token " },
      })

      expect(response.status).toEqual(200)
      expect(response.data.user).toMatchSnapshot({
        id: "admin_user",
        email: "admin@medusa.js",
        api_token: "test_token",
        role: "admin",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("lists users", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/users", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.users).toMatchSnapshot([
        {
          id: "admin_user",
          email: "admin@medusa.js",
          api_token: "test_token",
          role: "admin",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: "member-user",
          role: "member",
          email: "member@test.com",
          first_name: "member",
          last_name: "user",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ])
    })
  })

  describe("POST /admin/users", () => {
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

    it("creates a user", async () => {
      const api = useApi()

      const payload = {
        email: "test@test123.com",
        role: "member",
        password: "test123",
      }

      const response = await api
        .post("/admin/users", payload, {
          headers: { Authorization: "Bearer test_token" },
        })
        .catch((err) => console.log(err))

      expect(response.status).toEqual(200)
      expect(response.data.user).toMatchSnapshot({
        id: expect.stringMatching(/^usr_*/),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        role: "member",
        email: "test@test123.com",
      })
    })

    it("updates a user", async () => {
      const api = useApi()

      const updateResponse = await api
        .post(
          "/admin/users/member-user",
          { first_name: "karl" },
          {
            headers: { Authorization: "Bearer test_token " },
          }
        )
        .catch((err) => console.log(err.response.data.message))

      expect(updateResponse.status).toEqual(200)
      expect(updateResponse.data.user).toMatchSnapshot({
        id: "member-user",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        role: "member",
        email: "member@test.com",
        first_name: "karl",
        last_name: "user",
      })
    })

    describe("Password reset", () => {
      it("Doesn't fail when generating password reset token (unauthorized endpoint)", async () => {
        const api = useApi()

        const resp = await api
          .post("/admin/users/password-token", {
            email: user.email,
          })
          .catch((err) => {
            console.log(err)
          })

        expect(resp.data).toEqual("")
        expect(resp.status).toEqual(204)
      })

      it("Resets the password given a valid token (unauthorized endpoint)", async () => {
        const api = useApi()

        const expiry = Math.floor(Date.now() / 1000) + 60 * 15
        const dbUser = await dbConnection.manager.query(
          `SELECT * FROM public.user WHERE email = '${user.email}'`
        )

        const token_payload = {
          user_id: user.id,
          email: user.email,
          exp: expiry,
        }
        const token = jwt.sign(token_payload, dbUser[0].password_hash)

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            email: "test@forgottenpassword.com",
            password: "new password",
          })
          .catch((err) => console.log(err))

        const loginResult = await api.post("admin/auth", {
          email: "test@forgottenpassword.com",
          password: "new password",
        })

        expect(result.status).toEqual(200)
        expect(result.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
        expect(result.data.user.password_hash).toEqual(undefined)

        expect(loginResult.status).toEqual(200)
        expect(loginResult.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
      })

      it("Resets the password given a valid token without including email(unauthorized endpoint)", async () => {
        const api = useApi()

        const expiry = Math.floor(Date.now() / 1000) + 60 * 15
        const dbUser = await dbConnection.manager.query(
          `SELECT * FROM public.user WHERE email = '${user.email}'`
        )

        const token_payload = {
          user_id: user.id,
          email: user.email,
          exp: expiry,
        }
        const token = jwt.sign(token_payload, dbUser[0].password_hash)

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            password: "new password",
          })
          .catch((err) => console.log(err.response.data.message))

        const loginResult = await api.post("admin/auth", {
          email: user.email,
          password: "new password",
        })

        expect(result.status).toEqual(200)
        expect(result.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
        expect(result.data.user.password_hash).toEqual(undefined)

        expect(loginResult.status).toEqual(200)
        expect(loginResult.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
      })

      it("Fails to Reset the password given an invalid token (unauthorized endpoint)", async () => {
        expect.assertions(2)
        const api = useApi()

        const token = "test.test.test"

        await api
          .post("/admin/users/reset-password", {
            token,
            email: "test@forgottenpassword.com",
            password: "new password",
          })
          .catch((err) => {
            expect(err.response.status).toEqual(400)
            expect(err.response.data.message).toEqual("invalid token")
          })
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

    it("Deletes a user", async () => {
      const api = useApi()

      const userId = "member-user"

      const usersBeforeDeleteResponse = await api.get("/admin/users", {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      const usersBeforeDelete = usersBeforeDeleteResponse.data.users

      const response = await api
        .delete(`/admin/users/${userId}`, {
          headers: { Authorization: "Bearer test_token" },
        })
        .catch((err) => console.log(err))

      const usersAfterDeleteResponse = await api.get("/admin/users", {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: userId,
        object: "user",
        deleted: true,
      })

      const usersAfterDelete = usersAfterDeleteResponse.data.users

      expect(usersAfterDelete.length).toEqual(usersBeforeDelete.length - 1)
      expect(usersBeforeDelete).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: userId })])
      )

      expect(usersAfterDelete).toEqual(
        expect.not.arrayContaining([expect.objectContaining({ id: userId })])
      )
    })
  })
})

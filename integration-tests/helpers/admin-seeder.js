const Scrypt = require("scrypt-kdf")
const { User } = require("@medusajs/medusa/dist/models/user")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  const buf = await Scrypt.kdf("secret_password", { logN: 15, r: 8, p: 1 })
  const password_hash = buf.toString("base64")

  const user = await manager.insert(User, {
    id: "admin_user",
    email: "admin@medusa.js",
    api_token: "test_token",
    role: "admin",
    password_hash,
    ...data,
  })

  return { user, password_hash }
}

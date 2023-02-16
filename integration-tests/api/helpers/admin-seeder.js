const Scrypt = require("scrypt-kdf")
const { User } = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  const buf = await Scrypt.kdf("secret_password", { logN: 1, r: 1, p: 1 })
  const password_hash = buf.toString("base64")

  await manager.insert(User, {
    id: "admin_user",
    email: "admin@medusa.js",
    api_token: "test_token",
    role: "admin",
    password_hash,
    ...data,
  })
}

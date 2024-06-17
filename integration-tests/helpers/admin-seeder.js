const Scrypt = require("scrypt-kdf")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  const buf = await Scrypt.kdf("secret_password", { logN: 15, r: 8, p: 1 })
  const password_hash = buf.toString("base64")

  const user = await manager.insert("user", {
    id: "admin_user",
    email: "admin@medusa.js",
    ...data,
  })

  return { user, password_hash }
}

const { defineConfig, Modules } = require("@zjedene-medusa/utils")
const { generateKeyPairSync } = require("crypto")
const os = require("os")

const passphrase = "secret"
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase,
  },
})

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.DATABASE_URL = DB_URL
process.env.LOG_LEVEL = "error"

const jwtOptions = {
  algorithm: "RS256",
  expiresIn: "1h",
  issuer: "medusa",
  keyid: "medusa",
}

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    http: {
      jwtSecret: {
        key: privateKey,
        passphrase,
      },
      jwtPublicKey: publicKey,
      jwtOptions: jwtOptions,
    },
  },
  modules: [
    {
      key: Modules.USER,
      options: {
        jwt_secret: {
          key: privateKey,
          passphrase,
        },
        jwt_public_key: publicKey,
        jwt_options: jwtOptions,
      },
    },
  ],
})

import Scrypt from "scrypt-kdf"

export const getPasswordHash = async (password: string): Promise<string> => {
  const buf = await Scrypt.kdf(password, defaultAuthConfig)
  return buf.toString("base64")
}

export const defaultAuthConfig = { logN: 15, r: 8, p: 1 }

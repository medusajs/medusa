import { Request, Response } from "express"

export const AUTHENTICATE = false

export const GET = async (req: Request, res: Response) => {
  res.send(`GET /store/unprotected`)
}

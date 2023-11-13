import { Request, Response } from "express"

export const AUTHENTICATE = false

export const GET = (req: Request, res: Response) => {
  res.send(`GET /admin/unprotected`)
}

import { Request, Response } from "express"

export const POST = (req: Request, res: Response) => {
  if (req.body instanceof Buffer) {
    throw new Error("Body parser middleware was not applied")
  }

  res.send("OK")
}

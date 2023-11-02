import { Request, Response } from "express"

export const POST = (req: Request, res: Response) => {
  if (!(req.body instanceof Buffer)) {
    throw new Error("'req.body' should be a Buffer")
  }

  res.send("OK")
}

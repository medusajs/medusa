import { Request, Response } from "express"

export const POST = (req: Request, res: Response) => {
  if (!(req.body instanceof Buffer)) {
    res.status(400).send("Invalid body")
  }

  res.send("OK")
}

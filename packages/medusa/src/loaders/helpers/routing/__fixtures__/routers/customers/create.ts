import { Request, Response } from "express"

export function create(req: Request, res: Response) {
  res.send("create customers")
}

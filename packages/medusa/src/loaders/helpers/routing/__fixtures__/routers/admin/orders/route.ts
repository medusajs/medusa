import { Request, Response } from "express"

export function GET(req: Request, res: Response) {
  res.send("hello world")
}

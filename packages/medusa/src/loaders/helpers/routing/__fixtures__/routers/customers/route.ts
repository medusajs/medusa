import { NextFunction, Request, Response } from "express"

export function GET(req: Request, res: Response) {
  res.send("list customers")
}

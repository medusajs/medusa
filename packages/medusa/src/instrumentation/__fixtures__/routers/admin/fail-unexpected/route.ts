import { Request, Response } from "express"

export function GET(req: Request, res: Response) {
  throw new Error("Something went wrong")
}

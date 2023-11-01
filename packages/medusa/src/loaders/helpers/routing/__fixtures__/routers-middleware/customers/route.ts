import { Request, Response } from "express"

export function GET(req: Request, res: Response) {
  res.send("list customers")
}

export function POST(req: Request, res: Response) {
  res.send("create customer")
}

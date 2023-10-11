import { Request, Response } from "express"

export async function GET(req: Request, res: Response): Promise<void> {
  res.send("hello world")
}

export async function POST(req: Request, res: Response): Promise<void> {
  res.send("hello world")
}

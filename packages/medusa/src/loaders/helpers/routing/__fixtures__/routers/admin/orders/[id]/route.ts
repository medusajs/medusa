import { Request, Response } from "express"

export async function GET(req: Request, res: Response): Promise<void> {
  res.send(`GET order ${req.params.id}`)
}

export async function POST(req: Request, res: Response): Promise<void> {
  res.send(`POST order ${req.params.id}`)
}

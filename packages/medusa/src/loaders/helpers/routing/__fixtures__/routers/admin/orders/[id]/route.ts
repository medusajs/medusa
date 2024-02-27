import { Request, Response } from "express"

export async function GET(req: Request, res: Response): Promise<void> {
  try {
    res.send(`GET order ${req.params.id}`)
  } catch (err) {
    res.status(400).send(err)
  }
}

export async function POST(req: Request, res: Response): Promise<void> {
  try {
    res.send(`POST order ${req.params.id}`)
  } catch (err) {
    res.status(400).send(err)
  }
}

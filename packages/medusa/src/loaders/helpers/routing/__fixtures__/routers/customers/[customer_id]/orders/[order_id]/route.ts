import { Request, Response } from "express"

export function GET(req: Request, res: Response) {
  /* const customerId = req.params.id;
    const orderId = req.params.id;*/
  res.send("list customers " + JSON.stringify(req.params))
}

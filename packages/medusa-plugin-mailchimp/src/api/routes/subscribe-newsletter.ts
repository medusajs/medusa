import { Request, Response } from "express"

export async function add(req: Request, res: Response) {
  const mailchimpService = req.scope.resolve("mailchimpService")
  await mailchimpService.subscribeNewsletterAdd(
    req.body.email,
    req.body.data || {}
  )
  res.sendStatus(200)
}

export async function update(req: Request, res: Response) {
  const mailchimpService = req.scope.resolve("mailchimpService")
  await mailchimpService.subscribeNewsletterUpdate(
    req.body.email,
    req.body.data || {}
  )
  res.sendStatus(200)
}

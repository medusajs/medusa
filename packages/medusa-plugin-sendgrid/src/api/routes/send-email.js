export default async (req, res) => {
  // const schema = Validator.object().keys({
  //   template_id: Validator.string().required(),
  //   from: Validator.string().required(),
  //   to: Validator.string().required(),
  //   data: Validator.object().optional().default({}),
  // })

  // const { value, error } = schema.validate(req.body)
  // if (error) {
  //   throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  // }

  try {
    const sendgridService = req.scope.resolve("sendgridService")
    await sendgridService.sendEmail(
      req.body.template_id,
      req.body.from,
      req.body.to,
      req.body.data || {}
    )
    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}

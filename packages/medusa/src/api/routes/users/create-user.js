import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    password: Validator.string().required(),
  })

  console.log("test")

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const userService = req.scope.resolve("userService")
    console.log(value)
    let user = await userService.create(value)
    user = await userService.retrieve(user._id)
    res.status(201).json(user)
  } catch (err) {
    throw err
  }
}

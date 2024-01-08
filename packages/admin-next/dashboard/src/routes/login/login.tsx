import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import * as z from "zod"

import { Form } from "../../components/common/form"
import { useAuth } from "../../providers/auth-provider"

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || "/"

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    await login(email, password)
      .then(() => {
        navigate(from)
      })
      .catch((e) => {
        switch (e?.response?.status) {
          case 401:
            form.setError("password", {
              type: "manual",
              message: "Invalid email or password",
            })
            break
          default:
            form.setError("password", {
              type: "manual",
              message: "Something went wrong",
            })
        }
      })
  })

  return (
    <div className="flex flex-col gap-y-12">
      <div className="flex flex-col items-center">
        <Heading>Login</Heading>
        <Text>Welcome back. Login to get started!</Text>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-y-12">
          <Form.Field
            control={form.control}
            name="email"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Email</Form.Label>
                <Form.Control>
                  <Input {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Form.Field
            control={form.control}
            name="password"
            render={({ field }) => (
              <Form.Item>
                <div className="flex items-center justify-between">
                  <Form.Label>Password</Form.Label>
                  <Link
                    to={"/forgot-password"}
                    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover focus:text-ui-fg-interactive-hover transition-fg outline-none"
                  >
                    <Text leading="compact">Forgot password?</Text>
                  </Link>
                </div>
                <Form.Control>
                  <Input type="password" {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Button size="large" variant="secondary" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text } from "@medusajs/ui"
import { useAdminGetSession, useAdminLogin } from "medusa-react"
import { useForm } from "react-hook-form"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import * as z from "zod"

import { Form } from "../../components/common/form"
import { isAxiosError } from "../../lib/is-axios-error"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/"

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { user, isLoading } = useAdminGetSession()

  const { mutateAsync } = useAdminLogin({
    retry: false,
  })

  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    await mutateAsync(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          navigate(from, { replace: true })
        },
        onError: (e) => {
          if (isAxiosError(e)) {
            if (e.response?.status === 401) {
              form.setError("password", {
                type: "manual",
                message: "Invalid email or password",
              })

              return
            }
          }

          form.setError("password", {
            type: "manual",
            message: "Something went wrong",
          })
        },
      }
    )
  })

  if (user && !isLoading) {
    return <Navigate to={from} replace />
  }

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
                    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover transition-fg outline-none"
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

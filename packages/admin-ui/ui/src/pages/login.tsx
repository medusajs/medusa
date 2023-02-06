import { useAdminLogin } from "medusa-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PublicLayout from "../components/layouts/public-layout"

const Login = () => {
  const [resetPassword, setResetPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { mutate } = useAdminLogin()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    const email = form.email.value
    const password = form.password.value

    mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/")
        },
        onError: () => {
          setError("Invalid email or password")
        },
      }
    )
  }

  return (
    <PublicLayout>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </PublicLayout>
  )
}

export default Login

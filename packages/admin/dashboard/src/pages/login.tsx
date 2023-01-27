const Login = () => {
  // const { mutate } = useAdminLogin()
  // const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    const email = form.email.value
    const password = form.password.value

    // mutate(
    //   { email, password },
    //   {
    //     onSuccess: () => {
    //       navigate("/dashboard")
    //     },
    //     onError: () => {
    //       console.log("error")
    //     },
    //   }
    // )

    console.log(email, password)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login

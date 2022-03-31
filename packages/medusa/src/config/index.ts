export default {
    jwtSecret:
      process.env.NODE_ENV === "test" ? "test" : process.env.JWT_SECRET,
    cookieSecret:
      process.env.NODE_ENV === "test" ? "test" : process.env.COOKIE_SECRET
}

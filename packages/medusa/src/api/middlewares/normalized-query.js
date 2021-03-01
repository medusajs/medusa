export default () => {
  return (req, res, next) => {
    const clean = Object.entries(req.query).reduce((acc, [key, val]) => {
      if (Array.isArray(val) && val.length === 1) {
        acc[key] = val[0].split(",")
      } else {
        acc[key] = val
      }
      return acc
    }, {})

    req.query = clean

    next()
  }
}

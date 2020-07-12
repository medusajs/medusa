export default async (req, res) => {
  req.session.jwt = {}
  res.json({})
}

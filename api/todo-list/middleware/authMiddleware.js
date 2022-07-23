const jwt = require('jsonwebtoken')

const protect = async (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1]

  if (!token) {
    res.status(401)
    throw new Error('No token, authorization denied')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Invlaid token, authorization denied')
  }
}

module.exports = protect

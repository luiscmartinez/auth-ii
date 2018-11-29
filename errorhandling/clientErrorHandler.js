module.exports = (err, req, res, next) => {
  console.log(err.message)
  switch (err.message) {
    case 'Validation error: requirement':
      return res.status(400).json({
        error: 'enter a username between 4-20 chars',
        example: { username: 'moreThan4Chars' }
      })
      break
    case 'wrong credentials':
      return res.status(400).json({
        error: 'please check password or username'
      })
      break
    default:
      return res.status(500).json({ mes: err.message })
      break
  }
}

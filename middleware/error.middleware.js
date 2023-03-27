import * as Errors from '../utils/error.utils.js'

export const handleErrors = (err, req, res, next) => {
  if (!err) return next()
  if (!err.message) {
    res.status(500).send({ message: 'Woops, we encountered an error...' })
  } else if (err instanceof Errors.badRequestError) {
    res.status(400).send({ message: err.message })
  } else if (err instanceof Errors.unauthorizedError) {
    res.status(401).send({ message: err.message })
  } else if (err instanceof Errors.forbiddenError) {
    res.status(403).send({ message: err.message })
  } else if (err instanceof Errors.notFoundError) {
    res.status(404).send({ message: err.message })
  } else if (err instanceof Errors.methodNotAllowedError) {
    res.status(405).send({ message: err.message })
  } else if (err instanceof Errors.internalServerError) {
    res.status(500).send({ message: err.message })
  } else {
    res.status(500).send({ message: 'Woops, we encountered an error...' })
  }
}

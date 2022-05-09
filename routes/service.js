import express from 'express'
import passport from 'passport'

import {
  listServices,
  addService,
  updateService,
  deleteService,
} from './../controller/service.js'
import { addServiceValidation } from '../validation/service.js'
import { authArea } from '../middleware/auth'

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

router.post('/services', authArea, (req, res, next) => {
  const serviceValidation = addServiceValidation(req.body)
  if (serviceValidation.error)
    return res.status(400).send(serviceValidation.error.details[0].message)

  res.status(201).send({ message: 'Service created' })
})
router.get('/services', authArea, listServices)
router.put('/services', authArea, updateService)
router.delete('/services/:serviceId', authArea, deleteService)

export default router

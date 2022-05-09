import express from 'express'
import passport from 'passport'
import {
  listServices,
  addService,
  updateService,
  deleteService,
} from './../controller/service.js'

import { loggedInArea } from '../middleware/auth'

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

router.get('/services', loggedInArea, listServices)
router.post('/services', loggedInArea, addService)
router.put('/services', loggedInArea, updateService)
router.delete('/services/:serviceId', loggedInArea, deleteService)

export default router

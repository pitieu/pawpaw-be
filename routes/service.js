import express from 'express'
import passport from 'passport'
import {
  listServices,
  addService,
  updateService,
  deleteService,
} from './../controller/service.js'

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

router.post('/services', authArea, addService)
router.get('/services', authArea, listServices)
router.put('/services', authArea, updateService)
router.delete('/services/:serviceId', authArea, deleteService)

export default router

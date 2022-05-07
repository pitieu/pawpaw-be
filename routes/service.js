import express from 'express'
import passport from 'passport'
import serviceCtrl from './../controller/service.js'

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

router.get('/services', loggedInArea, serviceCtrl.listServices)
router.post('/services', loggedInArea, serviceCtrl.addService)
router.put('/services', loggedInArea, serviceCtrl.updateService)
router.delete('/services/:serviceId', loggedInArea, serviceCtrl.deleteService)

export default router

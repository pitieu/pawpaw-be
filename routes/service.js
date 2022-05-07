import express from 'express'
import passport from 'passport'
import serviceCtrl from './../controller/service.js'
import authCtrl from './../controller/auth.js'

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

router.get('/services', authCtrl.isLoggedIn, serviceCtrl.listServices)
router.post('/services', authCtrl.isLoggedIn, serviceCtrl.addService)
router.put('/services', authCtrl.isLoggedIn, serviceCtrl.updateService)
router.delete(
  '/services/:serviceId',
  authCtrl.isLoggedIn,
  serviceCtrl.deleteService,
)

export default router

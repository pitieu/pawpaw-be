import express from 'express'
import passport from 'passport'

import {
  listServices,
  addService,
  updateService,
  deleteService,
} from '../controller/service.js'
import { addServiceValidation } from '../validation/service.js'
import { authArea } from '../middleware/auth.js'
import { uploadServices } from '../utils/multer.utils.js'

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

router.post(
  '/',
  authArea,
  uploadServices.array('photos', 5),
  (req, res, next) => {
    // console.log(req.body.products)
    // console.log(req.body.productAddons)
    const serviceValidation = addServiceValidation(req.body)
    if (serviceValidation.error)
      return res.status(400).send(serviceValidation.error.details[0].message)

    console.log(req.files)
    res.status(201).send({ message: 'Service created' })
  },
)
router.get('/', authArea, listServices)
router.put('/', authArea, updateService)
router.delete('/:serviceId', authArea, deleteService)

export default router

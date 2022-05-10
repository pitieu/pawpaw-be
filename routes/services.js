import express from 'express'
import passport from 'passport'
import fs from 'fs'
import path from 'path'

import {
  listServices,
  addService,
  updateService,
  deleteService,
} from '../controller/service.js'
import { authArea } from '../middleware/auth.js'
import { uploadServices } from '../utils/multer.utils.js'

const router = express.Router()

const __dirname = path.resolve()

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
  async (req, res, next) => {
    try {
      if (req.files) {
        let photos = []
        req.files.forEach((file) => {
          photos.push({
            filename: file.filename,
            data: fs.readFileSync(
              path.join(__dirname + '/uploads/services/' + file.filename),
            ),
            contentType: file.mimetype,
          })
        })
        req.body.photos = photos
      }
      let products = []
      req.body.products.forEach((product) => {
        product.price = parseInt(product.price)
        products.push(product)
      })
      req.body.products = products

      let productAddons = []
      req.body.productAddons.forEach((product) => {
        product.price = parseInt(product.price)
        productAddons.push(product)
      })
      req.body.productAddons = productAddons
      req.body.pricePerKm = parseInt(req.body.pricePerKm)
      const newService = await addService(req.body, req.user._id)

      res.status(201).send({ message: 'Service created', id: newService._id })
    } catch (err) {
      next(err)
    }
  },
)
router.get('/', authArea, listServices)
router.put('/', authArea, updateService)
router.delete('/:serviceId', authArea, deleteService)

export default router

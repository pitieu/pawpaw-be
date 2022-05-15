import express from 'express'
import passport from 'passport'
import fs from 'fs'
import path from 'path'

import {
  fetchService,
  listServices,
  addService,
  updateService,
  deleteService,
  listServiceCategories,
} from '../controller/service.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'
import { uploadServices } from '../utils/multer.utils.js'
import debug from '../utils/logger.js'

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

const _createService = async (req, res, next) => {
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
}

const _fetchService = async (req, res, next) => {
  try {
    let service = await fetchService(
      { _id: req.params.serviceId },
      { 'photos.data': 0 },
    )
    res.status(200).send(service)
  } catch (err) {
    next(err)
  }
}

const _fetchServiceCategories = async (req, res, next) => {
  try {
    debug.info('Fetch Category')
    const categories = await listServiceCategories({})
    res.status(200).send({ categories: categories })
  } catch (err) {
    next(err)
  }
}

router.post('/', authArea, uploadServices.array('photos', 5), _createService)
router.get('/:serviceId/', _fetchService)
router.put('/:serviceId', authArea, updateService)
router.delete('/:serviceId', authArea, deleteService)
router.get('/category/list', _fetchServiceCategories)

export default router

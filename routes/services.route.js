import express from 'express'
import passport from 'passport'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import {
  fetchService,
  listServices,
  addService,
  updateService,
  deleteService,
  listServiceCategories,
} from '../controller/service.ctrl.js'
import { fetchStore } from '../controller/store.ctrl.js'
import {
  convertOpeningHoursToJson,
  addServiceValidation,
} from '../validation/service.validation.js'
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
    const hasAStore = await fetchStore({ owner_id: req.user._id })
    if (!hasAStore)
      throw {
        error: 'needs to create a store before it can create a service',
        status: 400,
      }

    if (req.body.products?.length) {
      req.body.products = JSON.parse(req.body.products)
    }
    if (req.body.product_addons?.length) {
      req.body.product_addons = JSON.parse(req.body.product_addons)
    }

    if (!req.body.price_per_km) {
      req.body.price_per_km = 0
    }
    delete req.body.primary_photo

    // if (req.body.opening_hours) {
    //   req.body.opening_hours = convertOpeningHoursToJson(req.body.opening_hours)
    // }

    // req.body.negotiable_hours_rate = parseInt(req.body.negotiable_hours_rate)
    // req.body.negotiable_hours = req.body.negotiable_hours == 'true'

    let photos = []
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i]
        const filename = `${file.filename}.webp`
        debug.info('file', filename)

        const buffer = fs.readFileSync(
          path.join(__dirname + '/uploads/services/' + file.filename),
        )
        // todo consider using multer-s3
        // https://stackoverflow.com/questions/40494050/uploading-image-to-amazon-s3-using-multer-s3-nodejs

        // todo make resize image work asynchronously to avoid server overloading
        await sharp(buffer)
          .webp({ quality: 20 })
          .toFile('./uploads/services/' + filename)

        photos.push({
          primary: file.originalname === req.body.primary_photo,
          filename: filename,
          // data: buffer,
          content_type: file.mimetype,
        })
      }
    }
    const serviceValidation = addServiceValidation(req.body)
    if (serviceValidation.error)
      throw {
        error: serviceValidation.error.details[0].message,
        status: 400,
      }

    req.body.photos = photos
    debug.info(req.files)
    debug.info(photos)
    const newService = await addService(req.body, req.user._id)

    res.status(201).send({
      status: 201,
      message: 'service created successfully',
      service_id: newService._id,
    })
  } catch (err) {
    try {
      if (req.files) {
        debug.info('Cleanup uploaded images because failed to create service')
        req.files.forEach((file) => {
          fs.unlink(__dirname + '/uploads/services/' + file.filename, () => {
            debug.info(
              'deleted ',
              __dirname + '/uploads/services/' + file.filename,
            )
          })
          fs.unlink(
            __dirname + '/uploads/services/' + file.filename + '.webp',
            () => {
              debug.info(
                'deleted ',
                __dirname + '/uploads/services/' + file.filename + '.webp',
              )
            },
          )
        })
      }
    } catch (e) {}
    next(err)
  }
}

const _fetchService = async (req, res, next) => {
  try {
    console.log('_fetchService')
    let service = await fetchService(
      { _id: req.params.service_id },
      { 'photos.data': 0, __v: 0, updatedAt: 0, createdAt: 0, deleted: 0 },
    )
    res.status(200).send(service)
  } catch (err) {
    next(err)
  }
}

const _listServiceCategories = async (req, res, next) => {
  try {
    debug.info('List Categories')
    const categories = await listServiceCategories({})
    res.status(200).send({ categories: categories })
  } catch (err) {
    next(err)
  }
}

const _listOwnedServices = async (req, res, next) => {
  try {
    console.log('list services', req.user)
    let services = await listServices(
      { user_id: req.user._id, deleted: false },
      { 'photos.data': 0, __v: 0, updatedAt: 0, createdAt: 0, deleted: 0 },
    )
    res.status(200).send(services)
  } catch (err) {
    next(err)
  }
}

const _showServiceImage = async (req, res, next) => {
  // todo serve images from amazon s3
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname, `./uploads/services/${req.params.image}`))
  } catch (err) {
    next(err)
  }
}

router.post('/', authArea, uploadServices.array('photos', 5), _createService)
router.get('/:service_id/', _fetchService)
router.put('/:service_id', authArea, updateService)
router.delete('/:service_id', authArea, deleteService)
router.get('/category/list', _listServiceCategories)
router.get('/', authArea, _listOwnedServices)
router.get('/images/:image', _showServiceImage)

export default router

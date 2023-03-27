import express from 'express'
import passport from 'passport'
import path from 'path'

import Service from '../model/Service.model.js'
import * as ServiceCtrl from '../controller/service.ctrl.js'
import * as MulterUtils from '../utils/multer.utils.js'
import debug from '../utils/logger.js'

import { authArea } from '../middleware/auth.middleware.js'
import * as ServiceMiddleware from '../middleware/services.middleware.js'
import * as AuthMiddleware from '../middleware/auth.middleware.js'
import { handleErrors } from '../middleware/error.middleware.js'

import {
  badRequestError,
  notFoundError,
  internalServerError,
} from '../utils/error.utils.js'

const router = express.Router()

const __dirname = path.resolve()

router.use(AuthMiddleware.initialize)
router.use(AuthMiddleware.session)

router.post(
  '/',
  authArea,
  ServiceMiddleware.hasAStore,
  ServiceMiddleware.sanitizeServiceData,
  MulterUtils.uploadServices.array('photos', 5),
  ServiceMiddleware.convertProductFields,
  ServiceMiddleware.handlePhotos,
  ServiceMiddleware.sanitizeServiceData,
  createServiceHandler,
  ServiceMiddleware.cleanupPhotosOnError,
)

router.get('/:service_id/', fetchServiceHandler)
router.patch(
  '/:serviceId',
  authArea,
  ServiceMiddleware.sanitizeServiceData,
  ServiceMiddleware.doesUserOwnService,
  MulterUtils.uploadServices.array('photos', 4),
  ServiceMiddleware.convertProductFields,
  ServiceMiddleware.handlePhotos,
  ServiceMiddleware.sanitizeServiceData,
  updateServiceHandler,
  ServiceMiddleware.cleanupPhotosOnError,
)

router.delete(
  '/:service_id',
  authArea,
  ServiceMiddleware.doesUserOwnService,
  ServiceCtrl.deleteService,
)
router.get('/category/list', listServiceCategoriesHandler)
router.get('/', authArea, listOwnedServicesHandler)
router.get('/images/:image', showServiceImageHandler)

const updateServiceHandler = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId
    const ownerId = req.user._id

    const photos = req.files?.map((file) => ({
      primary: file.originalname === req.body.primary_photo,
      filename: `${file.filename}.webp`,
      content_type: file.mimetype,
    }))

    const { price_per_km = 0, ...serviceData } = req.body
    const updatedService = await ServiceCtrl.updateService(
      serviceId,
      ownerId,
      serviceData,
      price_per_km,
      photos,
    )

    if (!updatedService) {
      throw new notFoundError('service not found')
    }

    res.json(updatedService)
  } catch (err) {
    next(err)
  }
}

const createServiceHandler = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      products,
      product_addons,
      price_per_km,
      delivery_location_store,
      delivery_location_home,
      opening_hours,
      negotiable_hours,
      negotiable_hours_rate,
    } = req.body

    // create a new service object with the extracted properties
    const service = new Service({
      name,
      description,
      category,
      products,
      product_addons,
      price_per_km,
      delivery_location_store,
      delivery_location_home,
      opening_hours,
      negotiable_hours,
      negotiable_hours_rate,
    })

    // save the service to the database
    await service.save()

    // send a response back to the client with the created service object
    res.status(201).json({
      status: 'success',
      data: {
        service,
      },
    })
  } catch (err) {
    throw new ServiceErrors.ServiceUploadError()
  }
}

const fetchServiceHandler = async (req, res, next) => {
  try {
    let service = await Service.findOne(
      { _id: req.params.service_id, deleted: false },
      { 'photos.data': 0, __v: 0, updatedAt: 0, createdAt: 0, deleted: 0 },
    )
      .populate('store_id', { __v: 0, updatedAt: 0, createdAt: 0, deleted: 0 })
      .lean()

    if (!service) {
      throw new ServiceErrors.ServiceNotFoundError()
    }

    res.json(service)
  } catch (err) {
    next(err)
  }
}

const listServiceCategoriesHandler = async (req, res, next) => {
  try {
    const categories = await ServiceCtrl.listServiceCategories({})
    if (!categories) {
      throw new ServiceErrors.ServiceCategoriesNotFoundError()
    }
    res.json({ categories: categories })
  } catch (err) {
    next(err)
  }
}

const listOwnedServicesHandler = async (req, res, next) => {
  try {
    let services = await Service.find(
      { user_id: req.user._id, deleted: false },
      {
        'photos.data': 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
        deleted: 0,
        opening_hours: 0,
      },
    )
      .populate('store_id', { __v: 0, updatedAt: 0, createdAt: 0, deleted: 0 })
      .populate('category', { key: 1, _id: 1 })
      .lean()

    if (!services) {
      throw new ServiceErrors.ServiceNotFoundError()
    }

    res.json(services)
  } catch (err) {
    next(err)
  }
}

const showServiceImageHandler = async (req, res, next) => {
  // todo serve images from amazon s3
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname, `./uploads/services/${req.params.image}`))
  } catch (err) {
    next(err)
  }
}

export default router

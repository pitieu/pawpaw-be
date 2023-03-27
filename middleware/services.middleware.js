import sharp from 'sharp'
import path from 'path'

import { Service } from '../models/service.model.js'
import { isOwnerOfService } from '../services/service.service.js'
import * as StoreCtrl from '../controller/store.ctrl.js'

import * as ServiceValidation from '../validation/service.validation.js'
import { notFoundError, unauthorizedError } from '../utils/error.utils.js'
import debug from '../utils/logger.js'
import { cleanupPhotos } from '../utils/files.utils.js'

export const hasAStore = async (req, res, next) => {
  try {
    const store = await StoreCtrl.fetchStore({ owner_id: req.user._id })
    if (!store) {
      throw new notFoundError('You must have a store first')
    }
    next()
  } catch (err) {
    next(err)
  }
}

export const doesServiceExist = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      throw new notFoundError('Service not found')
    }

    req.service = service
    next()
  } catch (err) {
    next(err)
  }
}

export const doesUserOwnService = async (req, res, next) => {
  try {
    const isOwner = await isOwnerOfService(req.body.id, req.user.id)
    if (!isOwner) {
      throw new unauthorizedError('Can only update services you own')
    }
    next()
  } catch (err) {
    next(err)
  }
}

export const convertProductFields = (req, res, next) => {
  try {
    if (req.body.products?.length) {
      req.body.products = JSON.parse(req.body.products)
    }
    if (req.body.product_addons?.length) {
      req.body.product_addons = JSON.parse(req.body.product_addons)
    }
    next()
  } catch (err) {
    next(err)
  }
}

export const handlePhotos = async (req, res, next) => {
  try {
    if (req.body.stored_photos) {
      req.body.stored_photos = JSON.parse(req.body.stored_photos)
    }
    let photos = []
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i]
        const filename = `${file.filename}.webp`

        const buffer = await sharp(
          path.join(__dirname + '/uploads/services/' + file.filename),
        )
          .webp({ quality: 20 })
          .toBuffer()

        photos.push({
          primary: file.originalname === req.body.primary_photo,
          filename: filename,
          content_type: file.mimetype,
        })
      }
    }

    delete req.body.primary_photo

    req.body.photos = req.body.stored_photos.concat(photos).map((photo) => {
      let _photo = {
        primary: photo.default || photo.primary,
        filename: photo.fileName || photo.filename,
        content_type: photo.type || photo.content_type,
      }

      if (photos.id) _photo._id = photo.id

      return _photo
    })
    next()
  } catch (err) {
    next(err)
  }
}

export const sanitizeServiceData = (req, res, next) => {
  const validationResult = ServiceValidation.serviceValidation(req.body)
  if (validationResult.error) {
    return res.status(400).send({
      error: validationResult.error.details[0].message,
      status: 400,
    })
  }
  next()
}

export const cleanupPhotosOnError = (err, req) => {
  if (err && req.files) {
    cleanupPhotos(req.files)
    res.status(500).json({ message: 'An error has occurred with the service' })
  } else {
    next(err)
  }
}

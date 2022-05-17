import multer from 'multer'

const storage = (storagePath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      // console.log('storagePath', storagePath)
      cb(null, storagePath)
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname +
          '-' +
          Date.now() +
          '-' +
          Math.round(Math.random() * 1e6),
      )
    },
  })
}

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export const uploadProfile = multer({
  storage: storage('uploads/profile/'),
  limits: { fileSize: 1024 * 1024 * 1 }, // limit size to 1 Mb
  fileFilter: imageFilter,
})

export const uploadServices = multer({
  storage: storage('uploads/services/'),
  limits: { fileSize: 1024 * 1024 * 1 }, // limit size to 1 Mb
  fileFilter: imageFilter,
})

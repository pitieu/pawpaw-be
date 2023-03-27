import fs from 'fs'

export const cleanupPhotos = (files) => {
  if (files) {
    files.forEach((file) => {
      fs.unlink(file.path, () => {
        debug.info('deleted ', file.path)
      })
      fs.unlink(`${file.path}.webp`, () => {
        debug.info(`deleted ${file.path}.webp`)
      })
    })
  }
}

export const cleanupPhoto = (file) => {
  fs.unlink(file.path, () => {
    debug.info('deleted ', file.path)
  })
  fs.unlink(`${file.path}.webp`, () => {
    debug.info(`deleted ${file.path}.webp`)
  })
}

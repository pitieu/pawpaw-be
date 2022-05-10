import mongoose from 'mongoose'

import debug from '../utils/logger.js'

// mongoose.set('debug', true)

export let mongooseInstance

export const initMongoose = async () => {
  mongooseInstance = await mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((i) => {
      debug.log('DB connection successful!')
      return i
    })
  //   console.log('instance', mongooseInstance)
  return mongooseInstance
}

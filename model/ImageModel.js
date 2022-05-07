import mongoose from 'mongoose'

export const imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
})

const Image = new mongoose.model('Image', imageSchema)

export default Image

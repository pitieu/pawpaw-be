import ServiceCategory from '../model/ServiceCategory.model.js'
import Categories from '../data/serviceCategory.js'
import { mongooseInstance } from '../mongodb/mongo.js'
import debug from '../utils/logger.js'

export const populateServiceCategory = async () => {
  let session = await mongooseInstance.startSession()
  session.startTransaction()
  try {
    const count = await ServiceCategory.find({}, session).count()
    if (!count) {
      await ServiceCategory.insertMany(Categories, { session })
      await session.commitTransaction()
    }
  } catch (e) {
    const abc = await session.abortTransaction()
    console.log(e)
  }
}

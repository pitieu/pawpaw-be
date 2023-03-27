import PostalCode from '../model/PostalCode.model.js'
import Province from '../model/Province.model.js'
import PostalCodeData from '../data/postalCode.js'
import ProvinceData from '../data/provinces.js'
import debug from '../utils/logger.js'

export const populatePostalCode = async () => {
  try {
    const count = await PostalCode.find({}).count()
    if (!count) {
      await PostalCode.insertMany(PostalCodeData)
    }
  } catch (e) {
    console.log(e)
  }
}

export const populateProvinces = async () => {
  try {
    const count = await Province.find({}).count()
    if (!count) {
      await Province.insertMany(ProvinceData)
    }
    // populate postalCode
    const countPostal = await PostalCode.find({}).count()
    if (!countPostal) {
      const provinces = await Province.find({})
      const _data = PostalCodeData.map((data) => {
        data.province_id = provinces.find(
          (province) => province.province_code == data.province_code,
        )._id
        return data
      })
      await PostalCode.insertMany(_data)
    }
  } catch (e) {
    console.log(e)
  }
}

import bcrypt from 'bcryptjs'

export const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export const validatePassword = (password, userPassword) => {
  return bcrypt.compare(password, userPassword)
}

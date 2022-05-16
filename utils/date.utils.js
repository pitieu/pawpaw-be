export const isDateValid = (date) => {
  return !isNaN(new Date(date).getTime())
}

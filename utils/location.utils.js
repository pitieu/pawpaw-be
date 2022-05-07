/**
 *
 * @param {String} locations
 * @returns
 */
export const locationStrToArr = (locations) => {
  locations = locations.split(',')

  // convert string to float
  locations[0] = +locations[0]
  locations[1] = +locations[1]

  // verify that they are float values
  if (isNaN(parseFloat(locations[0])) || isNaN(parseFloat(locations[1])))
    throw new Error('Invalid location format')

  return [locations[0], locations[1]]
}

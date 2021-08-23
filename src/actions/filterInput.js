const filterObject = (firstObject, secondObject) => {
  let filtered = {}

  Object.keys(secondObject).filter(el => {
    if (firstObject[el] != secondObject[el]) {
      filtered[el] = secondObject[el]
    }
  })
  return filtered
}

module.exports = filterObject
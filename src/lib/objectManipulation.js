function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function isEmpty (obj) {
  return Object.keys(obj).length === 0
}

export { deepCopy, isEmpty }

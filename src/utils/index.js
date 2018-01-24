module.exports.format_object = (data) => {
  return JSON.stringify(data, null, 2)
}

module.exports.sleep = (duration) => {
  return new Promise(resolve => setTimeout(() => resolve(), duration))
}

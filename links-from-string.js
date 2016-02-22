module.exports = (str) => {
  if (typeof str !== 'string') return []
  var reg = new RegExp(/[\w\d/?:@&-_=#]+\.([\w\d./?:@&-_=#])+/gi)
  var match = str.match(reg)
  return match || []
}

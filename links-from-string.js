module.exports = (str) => {
  var reg = new RegExp(/[\w\d/?:@&-_=#]+\.([\w\d./?:@&-_=#])+/gi)
  var match = str.match(reg)
  if (match) return match
}

const knownTLDs = [
  'com',
]

module.exports = {
  testString: (str) => {
    // Match protocol
    // match www
    // match known tlds
    const reg = new RegExp(
      // '(^|[\s\n]|<br\/?>)' + // Start of link
      '(https?|ftp)' +
      ':\\/\\/' +
      '([\\w\\-\\.]+)' +
      '($|[\\s\\n]|<br\\/?>)' // end of link
    , 'gi')
    const match = str.match(reg)
    
    return match ? match[0] : null
  }
}

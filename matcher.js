const knownTLDs = [
  'com',
  'net'
]

module.exports = {
  testString: (str) => {
    // Match protocol
    // match www
    // match known tlds
    var reg = new RegExp(
      // '(^|[\s\n]|<br\/?>)' + // Start of link
      '(https?|ftp)' +
      ':\\/\\/' +
      '([\\w\\-\\.]+)' +
      '($|[\\s\\n]|<br\\/?>)' // end of link
    , 'gi')
    var match = str.match(reg)

    if (match) return match[0]

    // Check for known tld

    reg = new RegExp(
      // '(^|[\s\n]|<br\/?>)' + // Start of link
      '([\\w\\-\\.]+)' +
      '.(' + knownTLDs.join('|') + ')' +
      '($|[\\s\\n]|<br\\/?>)' // end of link
    , 'gi')

    match = str.match(reg)

    if (match) return match[0]
  }
}

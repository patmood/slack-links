const knownTLDs = [
  'com',
  'net',
]

module.exports = {
  testString: (str) => {
    // Match protocol
    var reg = new RegExp(
      '(https?|ftp)' +
      ':\\/\\/' +
      '([\\w\\-\\.]+)' +
      '($|[\\s\\n]|<br\\/?>)' // end of link
    , 'gi')
    var match = str.match(reg)
    if (match) return match[0]

    // Match WWW subdomain
    reg = new RegExp(
      '(www\\.)' +
      '([\\w\\-\\.]+)' +
      '($|[\\s\\n]|<br\\/?>)' // end of link
    , 'gi')
    match = str.match(reg)
    if (match) return match[0]

    // Check for known tld
    reg = new RegExp(
      '([\\w\\-\\.]+)' +
      '.(' + knownTLDs.join('|') + ')' +
      '($|[\\s\\n]|<br\\/?>)' // end of link
    , 'gi')
    match = str.match(reg)
    if (match) return match[0]
  },
}

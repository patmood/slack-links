const test = require('tape')
const linksFromString = require('../links-from-string')

test('basic protocol', (t) => {
  t.plan(1)
  const expected = ['http://google.com']
  const actual = linksFromString('check out http://google.com')
  t.deepEqual(expected, actual)
})

test('secure protocol', (t) => {
  t.plan(1)
  const expected = ['https://google.com']
  const actual = linksFromString('check out https://google.com')
  t.deepEqual(expected, actual)
})

test('www subdomain', (t) => {
  t.plan(1)
  const expected = ['www.google.com']
  const actual = linksFromString('check out www.google.com')
  t.deepEqual(expected, actual)
})

test('known tld', (t) => {
  t.plan(1)
  const expected = ['google.com']
  const actual = linksFromString('check out google.com its great')
  t.deepEqual(expected, actual)
})

test('non word characters', (t) => {
  t.plan(1)
  const expected = ['http://www.27bslash6--2.com/']
  const actual = linksFromString('check out http://www.27bslash6--2.com/ its great')
  t.deepEqual(expected, actual)
})

test('multiple links in one string', (t) => {
  t.plan(1)
  const expected = ['google.com', 'www.reddit.com']
  const actual = linksFromString('check out google.com and www.reddit.com')
  t.deepEqual(expected, actual)
})

test('domain and path', (t) => {
  t.plan(1)
  const expected = ['https://www.reddit.com/r/birdswitharms/comments/46uftm/bollybird/']
  const actual = linksFromString('check out https://www.reddit.com/r/birdswitharms/comments/46uftm/bollybird/ lol')
  t.deepEqual(expected, actual)
})

test('various formats', (t) => {
  t.plan(15)
  t.equal(
    'https://www.stackoverflow.com',
    linksFromString('https://www.stackoverflow.com')[0]
  )
  t.equal(
    'https://w--ww.stackoverflow.com/',
    linksFromString('https://w--ww.stackoverflow.com/')[0]
  )
  t.equal(
    'http://wwww.stackoverflow.com/',
    linksFromString('http://wwww.stackoverflow.com/')[0]
  )
  t.equal(
    'http://wwww.stackov--erflow.com',
    linksFromString('http://wwww.stackov--erflow.com')[0]
  )
  t.equal(
    'http://test.test-75.1474.stackoverflow.com/',
    linksFromString('http://test.test-75.1474.stackoverflow.com/')[0]
  )
  t.equal(
    'http://www.stackoverflow.com',
    linksFromString('http://www.stackoverflow.com')[0]
  )
  t.equal(
    'http://www.stackoverflow.com/',
    linksFromString('http://www.stackoverflow.com/')[0]
  )
  t.equal(
    'stackoverflow.com/',
    linksFromString('stackoverflow.com/')[0]
  )
  t.equal(
    'stackoverflow.com',
    linksFromString('stackoverflow.com')[0]
  )
  t.equal(
    'http://www.example.com/etcetc',
    linksFromString('http://www.example.com/etcetc')[0]
  )
  t.equal(
    'www.example.com/etcetc',
    linksFromString('www.example.com/etcetc')[0]
  )
  t.equal(
    'example.com/etcetc',
    linksFromString('example.com/etcetc')[0]
  )
  t.equal(
    'user:pass@example.com/etcetc',
    linksFromString('user:pass@example.com/etcetc')[0]
  )
  t.equal(
    'http://stackoverflow.com/questions/6427530/regular-expression-pattern-to-match-url-with-or-without-http-www?hell=world&you=me',
    linksFromString('http://stackoverflow.com/questions/6427530/regular-expression-pattern-to-match-url-with-or-without-http-www?hell=world&you=me')[0]
  )
  t.equal(
    'http://stackoverflow.com/questions/6427530/regular-expression-pattern-to-match-url-with-or-without-http-www/',
    linksFromString('http://stackoverflow.com/questions/6427530/regular-expression-pattern-to-match-url-with-or-without-http-www/')[0]
  )
})

test('realistic message', (t) => {
  t.plan(1)
  const expected = ['1.gov.au', '2.com', '3.biz']
  const actual = linksFromString('1.gov.au is best for 1 thing, but personally i refer 2.com or 3.biz')
  t.deepEqual(expected, actual)
})

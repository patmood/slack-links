const test = require('tape')
const matcher = require('../matcher')

test('basic protocol', (t) => {
  t.plan(1)
  const expected = 'http://google.com'
  const actual = matcher.testString('check out http://google.com')
  t.equal(expected, actual)
})

test('secure protocol', (t) => {
  t.plan(1)
  const expected = 'https://google.com'
  const actual = matcher.testString('check out https://google.com')
  t.equal(expected, actual)
})

test('www subdomain', (t) => {
  t.plan(1)
  const expected = 'www.google.com'
  const actual = matcher.testString('check out www.google.com')
  t.equal(expected, actual)
})

test('known tld', (t) => {
  t.plan(1)
  const expected = 'google.com'
  const actual = matcher.testString('check out google.com')
  t.equal(expected, actual)
})

// test('known tld', (t) => {
//   t.plan(1)
//   const expected = 'google.com'
//   const actual = matcher.testString('check out google.com')
//   t.equal(expected, actual)
// })

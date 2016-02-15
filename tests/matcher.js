const test = require('tape')
const matcher = require('../matcher')

test('matcher', (t) => {
  t.plan(1)
  t.equal(matcher.testString('abc'), false)
})

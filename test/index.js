let bip65 = require('../')
let fixtures = require('./fixtures')
let test = require('tape')

fixtures.valid.forEach(function (f) {
  test(f.description, function (t) {
    let decode = bip65.decode(f.lockTime)
    let empty = Object.keys(decode).length === 0

    if (f.disabled) {
      t.same(empty, f.disabled, 'disabled')
    } else {
      if (f.blocks !== undefined) t.same(decode.blocks, f.blocks, 'blocks as expected')
      if (f.utc !== undefined) t.same(decode.utc, f.utc, 'utc as expected')
    }

    t.end()
  })
})

fixtures.invalid.forEach(function (f) {
  test(f.exception, function (t) {
    t.plan(1)

    t.throws(function () {
      bip65.encode(f)
    }, new RegExp(f.exception))
  })
})

let bip65 = require('../')
let fixtures = { valid: [], invalid: [] }

function binary (i) {
  return ('0'.repeat(32) + i.toString(2)).slice(-32)
}

function uint32hex (i) {
  return '0x' + ('00000000' + i.toString(16)).slice(-8)
}

function addFail (object) {
  try {
    bip65.encode(object)
  } catch (e) {
    fixtures.invalid.push(Object.assign({
      exception: e
    }, object))
    return
  }

  throw new Error(`No fail ${JSON.stringify(object)}`)
}

function addLockTime (i) {
  let result = {
    description: `${uint32hex(i)} (${binary(i)})`
  }
  Object.assign(result, bip65.decode(i), { lockTime: i })
  if (result.blocks === undefined && result.utc === undefined) {
    result.disabled = true
  }

  bip65.encode(result) // enforces no throw
  fixtures.valid.push(result)
}

for (let i = 0x00000000; i < 0x0000000f; ++i) addLockTime(i)
for (let i = 0x1dcd64d0; i < 0x1dcd6520; ++i) addLockTime(i)
addLockTime(0xffffffff)

addFail({ blocks: 0x1dcd6600 })
addFail({ blocks: null })
addFail({ blocks: 500000000 })
addFail({ utc: 1 })
addFail({ utc: 499999999 })
addFail({ utc: null })

console.log(JSON.stringify(fixtures, null, 2))

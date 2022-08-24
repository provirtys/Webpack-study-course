async function start() {
  return await Promise.resolve('async is working')
}

start().then(console.log)

const unused = 42

class Util {
  static id = Date.now()
}

console.log('Util id:', Util.id)

import('lodash').then(({ default: _ }) => {
  console.log('Lodash\t', _.random(0, 27, true))
})

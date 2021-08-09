const _ = require('lodash')
// TODO: 使用 ES6 的 generator 改写

function sequenceGenerator (map, initial = 1) {
  let i = initial
  return function () {
    return map(i++)
  }
}

function iteratedGenerator (items) {
  let i = 0 
  return function () {
    return items[i++]
  }
}

function incrementedGenerator (initial, add, map) {
  let next = initial
  return function () {
    const current = next
    next = add(current)
    return map(current)
  }
}

function rotatedGenerator (items, initial = 1) {
  let i = initial - 1
  return function () {
    return items[i++ % items.length]
  }
}

function cascadedGenerator (generators) {
  return function (associationValue) {
    return generators[associationValue]()
  }
}

function objectGenerator (objectGenerators, arrayGenerators = []) {
  return function () {
    const object = _.mapValues(objectGenerators, generate => generate())
    for (const generate of arrayGenerators) {
      const value = _.isFunction(generate) ? generate() : generate
      Object.assign(object, value)
    }
    return object
  }
}

function permutateTwo (items) {
  const permutatedItems = []
  for (let interval = 1; interval < items.length; interval++) {
    for (let j = 1; j < items.length; j++) {
      permutatedItems.push([items[j], items[(j + interval) % items.length]])
    }
  }
  return permutatedItems
}

module.exports = {
  sequenceGenerator,
  iteratedGenerator,
  incrementedGenerator,
  rotatedGenerator,
  cascadedGenerator,
  objectGenerator,
  permutateTwo
}

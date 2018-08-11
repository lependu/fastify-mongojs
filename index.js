'use strict'

const fp = require('fastify-plugin')
const mongojs = require('mongojs')

const fastifyMongojs = function (instance, opts, next) {
  const options = Object.assign({}, opts)

  const name = options.name || 'mongo'
  delete options.name

  if (typeof instance[name] !== 'undefined') {
    return next(new Error(`Decorator ${name} has registered`))
  }

  if (typeof options.url === 'undefined') {
    return next(new Error('url option is mandatory'))
  }

  const url = options.url
  delete options.url

  const collections = options.collections || []
  delete options.collections

  const db = mongojs(url, collections, options)

  db.on('error', err => {
    return next(err)
  })

  instance.decorate(name, db)
  instance.addHook('onClose', instance => instance[name].close())
  next()
}

module.exports = fp(fastifyMongojs, {
  fastify: '>=1.x',
  name: 'fastify-mongojs'
})

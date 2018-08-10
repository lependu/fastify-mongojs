'use strict'

const fp = require('fastify-plugin')
const mongojs = require('mongojs')

const fastifyMongojs = function (instance, opts, next) {
  const options = Object.assign({}, opts)

  const client = opts.client || ''
  delete opts.client

  const collections = opts.collections || []
  delete opts.collections

  const db = mongojs(client, collections, opts)

  db.on('error', function (err) {
    return next(err)
  })

  instance.decorate('mongo', db)
  instance.addHook('onClose', instance => instance.mongo.close())
  next()
}

module.exports = fp(fastifyMongojs, {
  fastify: '>=1.x',
  name: 'fastify-mongojs'
})

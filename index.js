'use strict'

const fp = require('fastify-plugin')
const mongojs = require('mongojs')

const fastifyMongojs = function (instance, opts, next) {
  const db = mongojs('localhost:27017/db', ['a'])

  instance.decorate('mongo', db)
  instance.addHook('onClose', instance => instance.mongo.close())
  next()
}

module.exports = fp(fastifyMongojs, {
  fastify: '>=1.x',
  name: 'fastify-mongojs'
})

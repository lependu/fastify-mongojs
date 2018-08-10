const tap = require('tap')
const Fastify = require('fastify')
const plugin = require('.')

const { test } = tap

test('Decorates fastify instance with db | default options', t => {
  t.plan(4)

  register(t, {}, function (err, fastify) {
    t.error(err)
    t.equal(typeof fastify.mongo, 'object')

    fastify.mongo.stats((err, res) => {
      t.error(err)
      t.equal(res.db, 'admin')
    })
  })
})

test('Decorates fastify instance with db | custom options', t => {
  t.plan(4)

  register(t, { client: 'db', collections: ['a']}, function (err, fastify) {
    t.error(err)
    t.equal(typeof fastify.mongo, 'object')

    fastify.mongo.stats((err, res) => {
      t.error(err)
      t.equal(res.db, 'db')
    })
  })
})

test('Handles mongojs error', t => {
  t.plan(3)

  register(t, {
    client: 'mongodb://1.0.0.1:27017/db?connectTimeoutMS=100',
    collections: ['a']
  }, function (err, fastify) {
    t.error(err)

    fastify.mongo.runCommand({ ping: 1 }, function (err) {
      t.ok(err instanceof Error)
      t.match(err.message, /failed to connect to server/)
    })
  })
})

function register (t, options, callback) {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(plugin, options)
    .ready(err => callback(err, fastify))
}

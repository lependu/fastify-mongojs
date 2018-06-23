const tap = require('tap')
const Fastify = require('fastify')
const plugin = require('.')

const { test } = tap

test('Decorates fastify instance with mongojs', t => {
  t.plan(4)

  register(t, {}, function (err, fastify) {
    t.error(err)
    t.equal(typeof fastify.mongo, 'object')

    fastify.mongo.stats((err, res) => {
      t.error(err)
      t.equal(res.db, 'db')
    })
  })
})

function register (t, options, callback) {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(plugin, options)
    .ready(err => callback(err, fastify))
}

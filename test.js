const tap = require('tap')
const Fastify = require('fastify')
const plugin = require('.')

const { test } = tap

test('Decorates fastify instance with db | without name', t => {
  t.plan(4)

  register(t, { url: 'db', collections: ['a'] }, function (err, fastify) {
    t.error(err)
    t.equal(typeof fastify.mongo, 'object')

    fastify.mongo.stats((err, res) => {
      t.error(err)
      t.equal(res.db, 'db')
    })
  })
})

test('Decorates fastify instance with db | with name', t => {
  t.plan(4)

  register(t, {
    name: 'db1',
    url: 'db1',
    collections: ['a']
  }, function (err, fastify) {
    t.error(err)
    t.equal(typeof fastify.db1, 'object')

    fastify['db1'].stats((err, res) => {
      t.error(err)
      t.equal(res.db, 'db1')
    })
  })
})

test('Paseses empty array if opts.collections missing', t => {
  t.plan(4)

  register(t, {
    name: 'db1',
    url: 'db1'
  }, function (err, fastify) {
    t.error(err)
    t.equal(typeof fastify.db1, 'object')

    fastify['db1'].stats((err, res) => {
      t.error(err)
      t.equal(res.collections, 0)
    })
  })
})

test('Throws if options.url not provided', t => {
  t.plan(2)

  register(t, {}, function (err, fastify) {
    t.ok(err instanceof Error)
    t.match(err.message, /url option is mandatory/)
  })
})

test('Throws if options.name has registered', t => {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify
    .decorate('alpha', {})
    .register(plugin, {
      name: 'alpha',
      url: 'db'
    })
    .ready(err => {
      t.ok(err instanceof Error)
      t.match(err.message, /Decorator alpha has registered/)
    })
})

test('Handles multiple connections', t => {
  t.plan(7)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify
    .register(plugin, {
      name: 'alpha',
      url: 'db1'
    })
    .register(plugin, {
      name: 'beta',
      url: 'db2'
    })
    .ready(err => {
      t.error(err)
      t.ok(fastify.alpha)
      t.ok(fastify.beta)
      fastify.alpha.stats((err, res) => {
        t.error(err)
        t.equal(res.db, 'db1')
      })
      fastify.beta.stats((err, res) => {
        t.error(err)
        t.equal(res.db, 'db2')
      })
    })
})

test('Handles mongojs error', t => {
  t.plan(3)

  register(t, {
    url: 'mongodb://1.0.0.1:27017/db?connectTimeoutMS=100',
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

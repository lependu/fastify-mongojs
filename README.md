# fastify-mongojs

Simple wrapper around [mongojs](https://github.com/mafintosh/mongojs) to share common connection pool across [Fastify](https://github.com/fastify/fastify) server.  
:warning: This project is **experimental** if you need something stable, take a look at [fastify-mongodb](https://github.com/fastify/fastify-mongodb)  

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/lependu/fastify-mongojs.svg?branch=master)](https://travis-ci.org/lependu/fastify-mongojs)
[![Known Vulnerabilities](https://snyk.io/test/github/lependu/fastify-mongojs/badge.svg)](https://snyk.io/test/github/lependu/fastify-mongojs)
[![Coverage Status](https://coveralls.io/repos/github/lependu/fastify-mongojs/badge.svg?branch=master)](https://coveralls.io/github/lependu/fastify-mongojs?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/lependu/fastify-mongojs.svg)](https://greenkeeper.io/)

## Install
```
$ npm i --save fastify-mongojs 
```

## Example
```js
  const Fastify = require('fastify')
  const fastifyMongojs = require('fastify-mongojs')
  
  const fastify = Fastify()

  fastify.register(fastifyMongojs, { 
    name: 'myMongo',
    url: 'myDb',
    collections: ['awesome_collection']
  })

  fastify.get('/', function(req, reply) => {
    // You can reach the db connection with fastify.myMongo
  })

  fastify.listen(3000, err => {
    if (err) throw err
  })  
```

## Reference
name | type | required | default 
-----| :------: | :----------: |---------
**`name`** | `{String}` | :x: | `'mongo'`  
**`url`** | `{String}` | :heavy_check_mark: |   
**`collections`** | `{Array}` | :x: | `[]`   
  
The only plugin specific option is `name` which makes possible to share multiple connection pools across the server instance.
The `url` and `collections` options will be passed to mongojs separately, all other options will be passed to the mongojs instance as well.
For more information about the avaiable options please see [mongojs](https://github.com/mafintosh/mongojs).  
  
## Caveats
Due the recent changes in [mongodb](https://github.com/mongodb/node-mongodb-native) if you pass mongodb connection to mongojs it will fail.
There is a [PR](https://github.com/mafintosh/mongojs/pull/353) in place which needs to be published first, to imlement this feature.  
  
## License
Licensed under [MIT](./LICENSE).

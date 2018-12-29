'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://spaceflight.wocloud.wangtiansoft.com/server/modules"',
  // BASE_API: '"http://10.240.45.192/server/modules"',
  // BASE_API: '"http://lt.ewanyuan.cn/server/modules"',
  IMG_API: '"http://img.wangtiansoft.com"'
  // IMG_API: '"http://ltx.ewanyuan.cn/"'
})

var fs = require('fs')
var os = require('os')
var Financial = require('../models/financial')
var Q    = require('q')

var cache = {}

module.exports = {
  isEC2: function () {
    return fs.existsSync('/proc/xen') && fs.existsSync('/etc/ec2_version')
  },

  isProd: function () {
    return os.platform() === 'linux'
  },

  getTheList : function() {
    var deferred = Q.defer()
    if ('list' in cache) {
        deferred.resolve(cache.list)
      } else {
        Financial.find({}, function(err, stock) {
          if (err) {
              console.log(err)
              deferred.reject(err)
          }
          console.log('returned the list!')
          console.log(stock)
          cache.list = stock
          deferred.resolve(cache.list)
        })
      }
      return deferred.promise
  }
}

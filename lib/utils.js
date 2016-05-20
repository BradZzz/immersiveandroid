var fs = require('fs')
var os = require('os')
var Q    = require('q')

var cache = {}

module.exports = {
  isEC2: function () {
    return fs.existsSync('/proc/xen') && fs.existsSync('/etc/ec2_version')
  },

  isProd: function () {
    return os.platform() === 'linux'
  },

  isJSON : function (str) {
    try {
      JSON.stringify(str)
    } catch (e) {
      console.log(e)
      return false
    }
    return true
  }
}

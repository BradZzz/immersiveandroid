var fs          = require('fs')
var os          = require('os')
var Q           = require('q')
var request     = require('request')
var parseString = require('xml2js').parseString

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
  },

  reqXMLJSON : function (url) {
    var deferred = Q.defer()
    console.log("querying: " + url)
    request(url, function(err, response, html){
        if (err) {
          deferred.resolve(err)
        }
        parseString(html, function (err, result) {
          if (err) {
            deferred.resolve(err)
          }
          deferred.resolve(result)
        })
    })
    return deferred.promise
  }
}

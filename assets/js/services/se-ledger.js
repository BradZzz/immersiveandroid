angular.module('ambrosia').service('seLedger',
['$http', '$q', '$rootScope', 'Flash',
function ($http, $q, $rootScope, Flash)
{
  var self = this
  self.logName = 'seLedger'
  self.cache = {}

  self.removePending = function (sym, callback) {
    $http({
      url: '/ledger/pending',
      method: 'DELETE',
      params: {
        sym : sym,
      },
    }).then(function (res) {
      console.log(res)
      delete self.cache['getCountList']
      callback(res.data)
    })
  }

  self.getPending = function (callback) {
    $http({
      url: '/ledger/pending',
      method: 'GET',
    }).then(function (res) {
      console.log(res)
      callback(res.data)
    })
  }

  self.submitPending = function (name, sym, cost, callback) {
    $http({
      url: '/ledger/pending',
      method: "POST",
      params: {
        name : name,
        sym : sym,
        cost : cost,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(res) {
      console.log('Success!')
      console.log(res)
      Flash.create('success', 'Order Placed')
      delete self.cache['getCountList']
      callback(res)
    }, function(err){
      console.log('Error!')
      console.log(err)
      Flash.create('danger', err.data.err)
      callback(err)
    })
  }

  self.getCountList = function () {
    if ('getCountList' in self.cache) {
      var deferred = $q.defer()
      deferred.resolve(self.cache.getCountList)
      console.log(self.cache.getCountList)
      return deferred.promise
    } else {
      return $http({
        url: '/ledger/count',
        method: 'GET',
      }).then(function (response) {
        console.log(response)
        self.cache.getCountList = response.data
        return self.cache.getCountList
      })
    }
  }

}])
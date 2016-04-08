angular.module('ambrosia').service('seLedger',
['$http', '$q', 'Flash',
function ($http, $q, Flash)
{
  var self = this
  self.logName = 'seLedger'

  self.removePending = function (sym, callback) {
    $http({
      url: '/ledger/pending',
      method: 'DELETE',
      params: {
        sym : sym,
      },
    }).then(function (res) {
      console.log(res)
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
      callback(res)
    }, function(err){
      console.log('Error!')
      console.log(err)
      Flash.create('danger', err.data.err)
      callback(err)
    })
  }

}]);

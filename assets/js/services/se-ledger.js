angular.module('ambrosia').service('seLedger',
['$http', '$q', 'Flash',
function ($http, $q, Flash)
{
  var self = this
  self.logName = 'seLedger'

  self.getPending = function (callback) {
    $http({
      url: '/ledger/pending',
      method: 'GET',
    }).then(function (res) {
      console.log(res)
      callback(res.data)
    })
  }

  self.submitPending = function (sym, cost, callback) {
    $http({
      url: '/ledger/pending',
      method: "POST",
      params: {
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

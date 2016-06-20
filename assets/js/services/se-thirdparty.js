angular.module('ambrosia').service('seThird',
['$http', '$q', '$rootScope', 'Flash',
function ($http, $q, $rootScope, Flash)
{
  var self = this
  self.logName = 'seLedger'
  self.cache = {}

  self.getCodewars = function () {
    return $http({
      url: '/third/codewar',
      method: 'GET',
    }).then(function (res) {
      console.log(res)
      return res.data.body
    })
  }

}])
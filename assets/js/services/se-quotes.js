angular.module('ambrosia').service('seQuotes',
['$http', '$q',
function ($http, $q)
{
  var self = this
  self.logName = 'seQuotes'
  self.cache = {}

  self.getOne = function (sym, period) {
    if ('getOne' in self.cache) {
      var deferred = $q.defer()
      deferred.resolve(self.cache.getOne)
      return deferred.promise
    } else {
        return $http({
          url: '/stock',
          method: 'GET',
          params: {
            sym: sym,
            period: period,
          }
        }).then(function (response) {
          self.print(response)
          self.cache.getOne = response.data
          return response.data
        })
    }
  }

  self.getList = function () {
    if ('getList' in self.cache) {
      var deferred = $q.defer()
      deferred.resolve(self.cache.getList)
      return deferred.promise
    } else {
      return $http({
        url: '/stock/list',
        method: 'GET',
      }).then(function (response) {
        self.print(response)
        self.cache.getList = response.data
        return response.data
      })
    }
  }

  self.getTestList = function () {
      if ('getTestList' in self.cache) {
        console.log('getTestList cache')
        var deferred = $q.defer()
        deferred.resolve(self.cache.getTestList)
        console.log(self.cache.getTestList)
        return deferred.promise
      } else {
        return $http({
          url: '/stock/testList',
          method: 'GET',
        }).then(function (response) {
          console.log('getTestList new')
          self.print(response)
          self.cache.getTestList = response.data
          console.log(self.cache.getTestList)
          return self.cache.getTestList
        })
      }
    }

  self.getCompany = function (sym) {
    if ('getCompany' in self.cache && sym in self.cache.getCompany) {
        var deferred = $q.defer()
        deferred.resolve(self.cache.getCompany[sym])
        return deferred.promise
    } else {
        return $http({
            url: '/stock/snapshot',
            method: 'GET',
            params: {
              sym: sym
            }
        }).then(function (response) {
            self.print(response)
            if (!('getCompany' in self.cache)) {
                self.cache.getCompany = {}
            }
            self.cache.getCompany[sym] = response.data
            return response.data
        })
    }
  }

  self.convertHighcharts = function (data) {
    return _.map(data, function(points){
        return [ parseInt(moment(points.date).format("x")) , points.low, points.high ]
     })
  }

  self.print = function (response) {
    console.log(self.logName + " response: ", response)
  }

}]);

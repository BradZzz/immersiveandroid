angular.module('ambrosia').service('seQuotes',
['$http', '$q', 'seLedger',
function ($http, $q, seLedger)
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

  //Only for demo
  /*self.getTestList = function () {
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
  }*/

  function replaceList(list){
      return seLedger.getCountList().then(function(ledger){
        console.log("ledger", ledger)
        return _.map(list,function(stock){
            console.log("comparing: ", stock.sym)
            if (stock.sym in ledger) {
                var meta = ledger[stock.sym]
                stock.invested = meta.invested
                stock.buyFee = meta.buyFee
                stock.totalFee = parseFloat((parseFloat(meta.buyFee) / parseFloat(meta.invested)).toFixed(2))
            }
            return stock
        })
      })
  }

  self.getPendingList = function (ticker) {
      var params = {}
      if (ticker) {
        params.ticker = ticker
      }
      return $http({
        url: '/stock/list',
        method: 'GET',
        params: params
      }).then(function (response) {
        return response.data
      })
  }

  self.getBuyPendingList = function (list) {
    return replaceList(list)
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

  self.getSearchCompany = function (contains) {
      return $http({
          url: '/stock/search',
          method: 'GET',
          params: {
            contains: contains
          }
      }).then(function (response) {
          return response.data
      })
  }

  self.getCompanyLedger = function (sym) {
      if ('getCompanyLedger' in self.cache && sym in self.cache.getCompanyLedger) {
          var deferred = $q.defer()
          deferred.resolve(self.cache.getCompanyLedger[sym])
          return deferred.promise
      } else {
          return $http({
              url: '/stock/financials',
              method: 'GET',
              params: {
                sym: sym
              }
          }).then(function (response) {
              self.print(response)
              if (!('getCompanyLedger' in self.cache)) {
                  self.cache.getCompanyLedger = {}
              }
              self.cache.getCompanyLedger[sym] = response.data
              return self.cache.getCompanyLedger[sym]
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

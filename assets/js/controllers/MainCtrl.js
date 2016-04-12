angular.module('ambrosia').controller('MainCtrl',
['$scope', '$rootScope', '$q', 'seQuotes', 'seLedger',
 function ($scope, $rootScope, $q, seQuotes, seLedger)
{
    console.log('MainCtrl')

    $rootScope.loading = true

    $scope.ctrl = {
        size : 25,
        list : {},
        links : ['share', 'save', 'hide', 'report']
    }

    seLedger.getCountList().then(function(list){
       list = _.map( list, function(entry){ return entry })
       console.log(list)
       list = _.filter( list, function(entry){ return entry.invested > 0 })
       console.log(list)
       list = _.sortBy( list, function(entry){ return -entry.invested }).splice(0,15)
       console.log(list)

       var promises = []

       _.each(list, function(stock){
         promises.push(seQuotes.getCompany(stock.ticker).then(function(result){
            var deferred = $q.defer()
            var newStock = stock
            newStock.info = result
            if (newStock.info.change === null) {
                newStock.info.change = 0
            }
            if (newStock.info.name) {
              newStock.name = newStock.info.name
            }
            deferred.resolve(newStock)
            return deferred.promise
         }))
       })

       $q.all(promises).then(
         function(results){
           console.log("Finished!")
           console.log(results)
           $scope.ctrl.list = results
           $rootScope.loading = false
         },function(err){
           console.log(err)
       })
    })
}])
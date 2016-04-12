angular.module('ambrosia').controller('MainCtrl',
['$scope', '$rootScope', '$q', 'seQuotes', 'seStatic',
 function ($scope, $rootScope, $q, seQuotes, seStatic)
{
    console.log('MainCtrl')

    $rootScope.loading = true

    $scope.ctrl = {
        size : 25,
        list : {},
        links : ['share', 'save', 'hide', 'report']
    }

    if (seStatic.main.length > 0) {
        $scope.ctrl.list = seStatic.main
        $rootScope.loading = false
    } else {
        seQuotes.getPendingList().then(function(list){
           console.log('finished')

           console.log(list)

           list = _.filter( list, function(entry){ return entry.invested > 0} )
           list = _.sortBy( list, function(entry){ return -entry.invested }).splice(0,15)

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
               seStatic.main = results
               $scope.ctrl.list = seStatic.main
               $rootScope.loading = false
             },function(err){
               console.log(err)
           })
        })
    }

}])
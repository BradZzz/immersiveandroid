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
        seQuotes.getTestList().then(function(list){
           console.log('finished')

           var newList = []
           list = _.map(list, function(pick){ return pick })

           console.log(list)

           while (newList.length < $scope.ctrl.size) {
                var index = chance.integer({min: 0, max: list.length - 1})
                console.log(list[index].ticker)
                if ((list[index].ticker).indexOf('^') === -1 && list[index].name) {
                    newList.push(list[index])
                    list.splice(index, 1)
                }
           }

           /* Here we need to query each of these stocks for its info */
           list = _.sortBy( newList , function(pick){ return -pick.invested })
           console.log('list', list)

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
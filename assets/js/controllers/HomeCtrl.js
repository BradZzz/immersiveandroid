angular.module('ambrosia').controller('HomeCtrl',
['$scope', '$rootScope', '$q', 'seQuotes', 'seLedger',
 function ($scope, $rootScope, $q, seQuotes, seLedger)
{
    console.log('HomeCtrl')

    $rootScope.loading = true

    //Call this when your controller is finished loading
    $rootScope.loading = false
}])
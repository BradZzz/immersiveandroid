angular.module('ambrosia').controller('AnalyticsCtrl',
['$scope', '$http', '$rootScope', '$state', '$timeout', 'sePrincipal', 'seLedger',
function ($scope, $http, $rootScope, $state, $timeout, sePrincipal, seLedger)
{

    $rootScope.loading = true
     $rootScope.loading = false

      $scope.ctrl = {  pending : []  }

      seLedger.getPending(function(data){ 
        console.log(data) 
        $scope.ctrl.pending = data
     })

}])
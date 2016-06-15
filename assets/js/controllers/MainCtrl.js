angular.module('ambrosia').controller('MainCtrl',
['$scope', '$rootScope', '$q', 'seMedia', 'seSenderHelper', 'sePrincipal',
 function ($scope, $rootScope, $q, seMedia, seSenderHelper, sePrincipal)
{
    console.log('MainCtrl')

    $rootScope.loading = true

    //Done loading
    $rootScope.loading = false
}])
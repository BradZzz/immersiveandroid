angular.module('ambrosia').controller('MainCtrl',
['$scope', '$rootScope', '$q', 'seThird',
 function ($scope, $rootScope, $q, seThird)
{
    console.log('MainCtrl')

    $scope.ctrl = {
        codewars : {},
        projectSize : 4,
    }

    $rootScope.loading = true

    seThird.getCodewars().then(function(data) {

        console.log(data)
        $rootScope.loading = false
        if ('username' in JSON.parse(data)) {
            $scope.ctrl.codewars = data
        }
        $rootScope.loading = false
    })
}])
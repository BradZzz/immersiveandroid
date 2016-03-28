angular.module('ambrosia').controller('ProfileCtrl',
['$scope', '$rootScope', '$state', 'seUser',
function ($scope, $rootScope, $state, seUser)
{

    $rootScope.loading = true
    $rootScope.loading = false

    $scope.ctrl = {
        test : seUser.user,
    }

}])
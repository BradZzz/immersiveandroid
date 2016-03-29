angular.module('ambrosia').controller('ProfileCtrl',
['$scope', '$rootScope', '$state', 'seUser',
function ($scope, $rootScope, $state, seUser)
{

    $rootScope.loading = true
    $rootScope.loading = false

    console.log(seUser.getUser())

    $scope.ctrl = {
        active : false,
        user : {},
        test : seUser.getUser(),
        saveClicked : function(user) {
            seUser.update(user, function(resp){
                console.log(resp)
                $scope.ctrl.active = false;
            })
        },
        states : ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
            'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
            'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    }

}])
angular.module('ambrosia').controller('ProfileCtrl',
['$scope', '$rootScope', '$state', 'seUser', 'seTheme',
function ($scope, $rootScope, $state, seUser, seTheme)
{

    $rootScope.loading = true
    $rootScope.loading = false

    console.log(seUser.getUser())

    $scope.ctrl = {
        active : false,
        user : seUser.getUser(),
        saveClicked : function(user) {
          seUser.update(user, function(resp){
            console.log(resp)
            $scope.ctrl.active = false;
          })
        },
        incBackground : function (offset) {
          if (this.user.background + offset > this.backgrounds.length - 1 ) {
            this.user.background = 0
          } else if (this.user.background + offset < 0 ) {
            this.user.background = this.backgrounds.length - 1
          } else {
            this.user.background += offset
          }
        },
        backgrounds : seTheme.backgrounds,
        states : ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
            'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
            'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    }



    //This runs once when the user refreshes the browser
    seUser.recover(function(data){
        console.log('finished',data)
        $rootScope.safeApply(function () {
          $scope.ctrl.user = seUser.getUser()
        })
    })

}])
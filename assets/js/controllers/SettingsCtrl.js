angular.module('ambrosia').controller('SettingsCtrl',
['$scope', '$http', '$rootScope', 'seMedia', 'sePrincipal', 'Flash',
function ($scope, $http, $rootScope, seMedia, sePrincipal, Flash)
{

    $rootScope.loading = true

    $scope.register = {
        active : false,
        submit : function () {
            console.log(arguments)
            sePrincipal.register.apply(this, arguments).then(function(){
                $scope.register.form = {}
                $scope.ctrl.refresh()
            }, function (err){
                console.log(err)
            })
        }
    }

    $scope.password = {
        active : false,
        submit : function () {
            console.log(arguments)
            if (arguments[0] && arguments[1] && arguments[2]) {
                if (arguments[1] !== arguments[2]) {
                    Flash.create('danger', 'Your new passwords don\'t match... I am very disappointed.')
                } else {
                    sePrincipal.updatePassword.apply(this, arguments).then(function(data){
                        $scope.password.form = {}
                        $scope.ctrl.refresh()
                    }, function(err) {
                        console.log(err)
                    })
                }
            } else {
                Flash.create('danger', 'Fill out all the fields. You know how to do this...')
            }
        }
    }

    $scope.ctrl = {
        active : false,
        refresh : function () {
            sePrincipal.identity().then( function(data){
                $scope.ctrl.user = data
                if (!('exclude' in $scope.ctrl.user)) {
                    $scope.ctrl.user.exclude = []
                }
                $rootScope.loading = false
            })
        },
        user : {}
    }

    $scope.ctrl.refresh()
}])
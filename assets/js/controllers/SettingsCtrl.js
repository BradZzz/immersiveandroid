angular.module('ambrosia').controller('SettingsCtrl',
['$scope', '$http', '$rootScope', 'seMedia', 'sePrincipal',
function ($scope, $http, $rootScope, seMedia, sePrincipal)
{

    $rootScope.loading = true

    $scope.ctrl = {
        active : false,
        getMedia : function () {
            seMedia.getMedia().then(function(meta){
                console.log(meta)
                console.log($scope.ctrl.user)
                var nameArray = _.map($scope.ctrl.user.exclude, function(item){
                    return item.name
                })
                console.log(nameArray)
                $scope.ctrl.meta = _.filter(meta, function(media){
                    return media.type === 'tv' && nameArray.indexOf(media.name) === -1
                })
                console.log($scope.ctrl.meta)
                $rootScope.loading = false
            })
        },
        refresh : function () {
            sePrincipal.identity().then( function(data){
                $scope.ctrl.user = data
                if (!('exclude' in $scope.ctrl.user)) {
                    $scope.ctrl.user.exclude = []
                }
                $scope.ctrl.getMedia()
            })
        },
        user : {},
        saveClicked : function(user) {
          sePrincipal.update(user).then(function(resp){
            $scope.ctrl.user = resp
            $scope.ctrl.active = false
            console.log($scope.ctrl.user)
          })
        },
        meta : [],
        unselectable : [],
        add : function(index) {
            this.active = true
            this.user.exclude.push(this.meta[index])
            this.user.exclude = _.sortBy(this.user.exclude, 'name')
            this.meta.splice(index,1)
        },
        remove : function(index) {
            this.active = true
            this.meta.push(this.user.exclude[index])
            this.meta = _.sortBy(this.meta, 'name')
            this.user.exclude.splice(index,1)
        }
    }

    $scope.ctrl.refresh()
}])
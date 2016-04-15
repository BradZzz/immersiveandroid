angular.module('ambrosia').controller('MediaCtrl',
['$scope', '$rootScope', '$stateParams', '$state', 'seMedia',
function ($scope, $rootScope, $stateParams, $state, seMedia)
{

    $rootScope.loading = true
    $rootScope.loading = false

    $scope.ctrl = {
        pValue : $stateParams.value,
        pType : $stateParams.type,
        viewType : 'movie',
        meta : [],
        pLocalMedia : function (meta) {
            console.log('sending meta', meta)
            var path = meta.path
            if ('sEpisode' in meta) {
                path = meta.sEpisode
            }
            $state.go('localplayer', { path: path, poster: meta.poster })
        }
    }

    seMedia.getMedia().then(function(response){
      console.log('response', response)
      if ($scope.ctrl.pType === 'title') {
        $scope.ctrl.meta = _.filter(response, function(media){ return media.name === $scope.ctrl.pValue })
      } else if ($scope.ctrl.pType === 'genre') {
        $scope.ctrl.meta = _.filter(response, function(media){ return _.contains(media.genre, $scope.ctrl.pValue) })
      }
      console.log('meta', $scope.ctrl.meta)
    })

    $scope.$on('updateVType', function (event, data) {
      console.log('update', data)
      $scope.ctrl.viewType = data.type
    })

    console.log($rootScope.toState.name)

}])
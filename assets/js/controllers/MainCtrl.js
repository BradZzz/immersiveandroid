angular.module('ambrosia').controller('MainCtrl',
['$scope', '$rootScope', '$q', 'seMedia', 'seSender',
 function ($scope, $rootScope, $q, seMedia, seSender)
{
    console.log('MainCtrl')

    $rootScope.loading = true
    $rootScope.loading = false

    /*
     * TODO:
     * Keep iterator going after end of show
     * Keep sticky going on channel up
     * make progress bar stop updating when progress selected from ui
     */

    seSender.setup()

    $scope.sChannel = {
        name : "Sample Channel",
        shows : ["tt0397306", "tt1486217", "tt1561755"]
    }

    $scope.params = {
        paused : false,
        casting : false,
        seeking : false,
        selected : null,
        channel : $scope.sChannel,
        map : {},
        progress : 0,
    }

    seMedia.getMedia().then(function(meta){
        _.each(meta, function (file){
            if ('imdbId' in file && !('imdbId' in $scope.params.map)) {
                $scope.params.map[file['imdbId']] = file
            }
        })
        console.log('formatted', $scope.params.map)
        seMedia.getMediaStatic().then(function(data){
            $scope.params.pre = data.pre
            $scope.params.post = data.post

            $scope.ctrl = {
              init : function () {
                this.loadMedia()
              },
              loadMedia : function () {
                var picked = this.pickMedia()
                console.log('picked: ', picked)
                $scope.params.progress = 0
                seSender.loadCustomMedia( $scope.params.pre + picked + $scope.params.post )
              },
              pickMedia : function () {
                var iSelection = chance.integer({min: 0, max: $scope.params.channel.shows.length - 1})
                if ($scope.params.selected !== null) {
                    var nSelection = _.indexOf($scope.params.channel.shows, $scope.params.selected.imdbId)
                    while (nSelection === iSelection) {
                        iSelection = chance.integer({min: 0, max: $scope.params.channel.shows.length - 1})
                    }
                }
                var selected = $scope.params.selected = $scope.params.map[$scope.params.channel.shows[iSelection]]
                if (selected.episodes.length == 0) {
                    return selected.path
                } else {
                    return selected.episodes[chance.integer({min: 0, max: selected.episodes.length - 1})]
                }
              },
              prevM : function () {
                console.log('prev')
                if ($scope.params.progress > 10) {
                    $scope.params.progress = 0
                    this.seekHelper(0)
                } else {
                    this.loadMedia()
                }

              },
              nextM : function () {
                console.log('next')
                this.loadMedia()
              },
              seekM : function () {
                console.log('seek')
                this.seekHelper($scope.params.progress)
              },
              seekHelper : function (progress) {
                $scope.params.seeking = true
                seSender.seekMedia(progress)
              },
              playM : function () {
                if ($scope.params.paused) {
                  seSender.playMedia(false)
                } else {
                  seSender.playMedia(true)
                }
                $scope.params.paused = !$scope.params.paused
              },
              toggleCast : function(){
                console.log('toggle', $scope.params.casting)
                if ($scope.params.casting) {
                  seSender.stopApp()
                } else {
                  seSender.launchApp()
                }
                $scope.params.casting = !$scope.params.casting
              }
            }
        })
    })

    //Receivers
    $scope.$on('update', function (scope, media) {
      console.log('on-update')
    })
    $scope.$on('retry', function () {
      console.log('on-retry')
    })
    $scope.$on('progress', function (scope, progress) {
      if ($scope.params.seeking) {
        if ($scope.params.progress === progress) {
            $scope.params.seeking = false
        }
      } else {
        $scope.params.progress = progress
      }
    })
    $scope.$on('finish', function () {
       console.log('on-finish')
       $scope.ctrl.loadMedia()
    })
    $scope.$on('init', function () {
        console.log('init')
        $scope.ctrl.init()
    })

}])
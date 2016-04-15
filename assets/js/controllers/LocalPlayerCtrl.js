angular.module('ambrosia').controller('LocalPlayerCtrl', ['$rootScope', '$scope', '$stateParams', '$sce',
function ($rootScope, $scope, $stateParams, $sce)
{
    $rootScope.loading = true
    $rootScope.loading = false

    console.log($stateParams.path)

    var fullPath = "https://s3.amazonaws.com/mytv.media.out.video/" + $stateParams.path + "index.mp4"
    console.log(fullPath)

    $scope.ctrl = {
        config : {
            sources: [
                {src: $sce.trustAsResourceUrl(fullPath), type: "video/mp4"}
            ],
            //subs
            tracks: [
                /*{
                    src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }*/
            ],
            theme: "/assets/third-party/videogular-themes-default/videogular.css",
            plugins: {
                poster: $stateParams.path
            }
        }
    }
}]);

angular.module('ambrosia').controller('MainCtrl',
['$scope', '$rootScope', '$q', 'seThird', 'sePrincipal',
 function ($scope, $rootScope, $q, seThird, sePrincipal)
{
    console.log('MainCtrl')

    $rootScope.loading = true

    $scope.ctrl = {
        codewars : {},
        projectSize : 4,
        user : {},
        links : {
            class : [
                {name : 'Curriculum', link : '/curr'}
            ],
            instructor : [
                {name : 'Course Tracker', link : 'https://docs.google.com/a/generalassemb.ly/spreadsheets/d/1HjYtpOPn7P4iZ4U8krICe94uyDZFzlHMJpCoe1Q7Hos/edit?usp=sharing'}
            ],
            student : [
                {name : 'Java 8 Pocket Guide', link : 'https://drive.google.com/a/generalassemb.ly/file/d/0B5fuaRbOMsNyakZ1dmdaOGNUTGM/view?usp=sharing'},
                {name : 'Java in a nutshell', link : 'https://drive.google.com/a/generalassemb.ly/file/d/0B5fuaRbOMsNyZllheVo4T2RqLWM/view?usp=sharing'},
                {name : 'Head First Android Development', link : 'https://drive.google.com/a/generalassemb.ly/file/d/0B5fuaRbOMsNySlluYUI0T0dsX1E/view?usp=sharing'},
                {name : 'Code Path Android', link : 'https://guides.codepath.com/android'},
            ],
        },
        isEmpty : function(object) { return Object.getOwnPropertyNames($scope.ctrl.codewars).length == 0 },
        refresh : function () {
            sePrincipal.identity().then( function(data){
                $scope.ctrl.user = data
                $rootScope.loading = false
            })

            seThird.getCodewars().then(function(data) {
                console.log(data)
                $rootScope.loading = false
                if ('username' in JSON.parse(data)) {
                    $scope.safeApply(function () {
                        $scope.ctrl.codewars = JSON.parse(data)
                        $scope.ctrl.codewars.ranks.overall.rank = Math.abs($scope.ctrl.codewars.ranks.overall.rank)
                        $scope.ctrl.codewars.logoStyle = { background: $scope.ctrl.codewars.ranks.overall.color }
                    })
                }
            })
        },
    }

    $scope.ctrl.refresh()

}])
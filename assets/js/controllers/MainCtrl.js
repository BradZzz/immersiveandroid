angular.module('ambrosia').controller('MainCtrl',
['$scope', '$rootScope', '$q', 'seThird', 'sePrincipal',
 function ($scope, $rootScope, $q, seThird, sePrincipal)
{
    console.log('MainCtrl')

    $rootScope.loading = true

    //Hey!!!!

    $scope.ctrl = {
        codewars : {},
        projectSize : 4,
        user : {},
        links : {
            class : [
                {name : 'Trello Schedules', link : 'https://trello.com/adi01sea'},
                {name : 'Curriculum', link : 'https://bradzzz.gitbooks.io/android-sea/content/01_intro/'},
                {name: 'Class Slack Channel', link: 'https://ga-students.slack.com/messages/adi-sea-01/'},
                {name: 'App Ideas Repo', link: 'https://github.com/ga-students/adi-sea-01-app-ideas'}
            ],
            instructor : [
                {name : 'Course Tracker', link : 'https://docs.google.com/a/generalassemb.ly/spreadsheets/d/1HjYtpOPn7P4iZ4U8krICe94uyDZFzlHMJpCoe1Q7Hos/edit?usp=sharing'},
                {name : 'GitBooks Repo', link : 'https://github.com/BradZzz/adi-mudkipz'},
                {name : 'Web Site Repo', link : 'https://github.com/BradZzz/immersiveandroid'},
                {name : 'Course Materials Repo', link : 'https://github.com/WDI-SEA/ADI-course-materials'}
            ],
            prework: [
                {name : 'Learn the Command Line (3 hours)', link : 'https://www.codecademy.com/learn/learn-the-command-line'},
                {name : 'Learn Git (15 minutes)', link : 'https://try.github.io/levels/1/challenges/1'},
                {name : 'Learn Java (complete sections 1 through 4)', link : 'https://www.codecademy.com/learn/learn-java'},
                {name : 'XML Video (18 minutes)', link : 'https://vimeo.com/9764458'},
            ],
            student : [
                {name : 'Clean Android Coid', link : 'https://medium.com/android-news/keep-your-droid-clean-activities-and-fragments-da1799fe1e7a#.irzx6o2lr'},
                {name : 'Java 8 Pocket Guide', link : 'https://drive.google.com/a/generalassemb.ly/file/d/0B5fuaRbOMsNyakZ1dmdaOGNUTGM/view?usp=sharing'},
                {name : 'Java in a nutshell', link : 'https://drive.google.com/a/generalassemb.ly/file/d/0B5fuaRbOMsNyZllheVo4T2RqLWM/view?usp=sharing'},
                {name : 'Head First Android Development', link : 'https://drive.google.com/a/generalassemb.ly/file/d/0B5fuaRbOMsNySlluYUI0T0dsX1E/view?usp=sharing'},
                {name : 'Code Path Android', link : 'https://guides.codepath.com/android'},
            ],
        },
        githubUsernames: [
          "Baron-Severin",
          "duffin22",
          "mgkang0206",
          "don93",
          "Rcureton",
          "bradzzz",
          "geluso"
        ],
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

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
                {name : 'Trello Schedules', link : 'https://trello.com/b/xXgCmjx4/lesson-planning'},
                {name : 'Curriculum', link : 'https://bradzzz.gitbooks.io/ga-seattle-dsi/content/'},
                {name: 'Class Slack Channel', link: 'https://ga-students.slack.com/messages/dsi-sea-01/'}
            ],
            instructor : [
                {name : 'Course Tracker', link : 'https://docs.google.com/spreadsheets/u/2/d/1EVxQbIVQadiZBJMej44ck78ZJhH385nqphUJnYJMalg/edit?usp=drive_web'},
                {name : 'GitBooks Repo', link : 'https://github.com/ga-students/dsi-gitbook'},
                {name : 'Web Site Repo', link : 'https://github.com/BradZzz/immersiveandroid'},
                {name : 'Course Materials Repo', link : 'https://github.com/ga-students/GA_DSI_Private'},
                {name : 'License Template', link : 'https://github.com/ga-students/adi-sea-license-template'},
            ],
            prework: [
                {name : 'Learn the Command Line (3 hours)', link : 'https://www.codecademy.com/learn/learn-the-command-line'},
                {name : 'Learn Git (15 minutes)', link : 'https://try.github.io/levels/1/challenges/1'},
            ],
            student : [
                {name : 'Python Pocket Guide', link : 'http://dl.finebook.ir/book/5a/14472.pdf'},
                {name : 'Tableau Key', link : 'http://www.tableau.com/tft/activation', info: 'Desktop Key: TD2H-209E-3950-8AB0-5D46\n Instructions: Click on the link above and select Get Started. On the form, enter your university email address for “Business email”; and under "Organization", please input the name of your school.'}
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
                /*if ('username' in JSON.parse(data)) {
                    $scope.safeApply(function () {
                        $scope.ctrl.codewars = JSON.parse(data)
                        $scope.ctrl.codewars.ranks.overall.rank = Math.abs($scope.ctrl.codewars.ranks.overall.rank)
                        $scope.ctrl.codewars.logoStyle = { background: $scope.ctrl.codewars.ranks.overall.color }
                    })
                }*/
            })
        },
    }

    $scope.ctrl.refresh()

}])

angular.module('ambrosia').controller('AttendanceCtrl',
['$scope', '$rootScope', '$q', 'sePrincipal',
 function ($scope, $rootScope, $q, sePrincipal)
{
    console.log('AttendanceCtrl')

    $rootScope.loading = true

    $scope.ctrl = {
      user : {},
      counter : Array,
      //This is the length of the class
      weeks : 12,
      //This is when the class starts
      start : moment("06/27/16", "MM/DD/YYYY"),
      currentWeek : 0,
      currentData : {},
      students : [],
      teachers : [],
      //This is called when the week is clicked on the side nav
      nav : function (week) {
        this.currentWeek = week
        this.currentData = this.getWeek()
      },
      getWeek: function() {
        var thisWeek = moment(this.start).add(this.currentWeek, 'weeks')

        return [{ name: 'Monday', date: moment(thisWeek).format('L') },
                { name: 'Tuesday', date: moment(thisWeek).add(1, 'days').format('L') },
                { name: 'Wednesday', date: moment(thisWeek).add(2, 'days').format('L') },
                { name: 'Thursday', date: moment(thisWeek).add(3, 'days').format('L') },
                { name: 'Friday', date: moment(thisWeek).add(4, 'days').format('L') }]
      },
      //user, day selected, status(present/tardy/etc)
      markAtt: function(student, day, status) {
        if (this.hasAtt(student, day) === -1) {
            //This is the day that they clicked
            var thisWeek = moment(this.start).add(this.currentWeek, 'weeks')
            thisWeek = moment(thisWeek).add(day, 'days')

            //We need to switch out the time that they clicked it
            var now = moment()
            var formatted = null

            if (status == 1 && (now.hours() > 9 || (now.hours() === 9 && now.minutes() > 15))) {
                formatted = moment({ years: thisWeek.years(), months: thisWeek.months(), date: thisWeek.date(), hours: 9, minutes: 10, seconds: now.seconds() })
            } else if (status == 0 && (now.hours() < 9 || (now.hours() === 9 && now.minutes() <= 15))) {
                formatted = moment({ years: thisWeek.years(), months: thisWeek.months(), date: thisWeek.date(), hours: 9, minutes: 20, seconds: now.seconds() })
            } else {
                formatted = moment({ years: thisWeek.years(), months: thisWeek.months(), date: thisWeek.date(), hours: now.hours(), minutes: now.minutes(), seconds: now.seconds() })
            }



            sePrincipal.markAtt(student.email, formatted).then(function(res){
                student.attendance.push({ signer: student.email, date : formatted })
                $scope.ctrl.organizeAtt(student)
            })
        }
      },
      hasAtt: function(student, day){

        if (this.currentWeek in student.attendenceFormatted) {
            if (day in student.attendenceFormatted[this.currentWeek]){
                return student.attendenceFormatted[this.currentWeek][day]
            }
        }

        return -1

        /*var search = moment(this.start).add(this.currentWeek, 'weeks').add(day, 'days')
        var myDate = _.find(student.attendance,function(att){
            var thisAtt = moment(att.date)
            return thisAtt.years() === search.years() && thisAtt.months() === search.months() && thisAtt.date() === search.date()
        })

        if (myDate === undefined) {
          return -1
        } else {
            if (moment(myDate.date).hours() < 9 || (moment(myDate.date).hours() === 9 && moment(myDate.date).minutes() <= 15)) {
                return 1
            } else {
                return 0
            }
        }*/
      },
      organizeAtt: function (student) {
        student.attendenceFormatted = {}
        for (var att in student.attendance) {
            var days    = moment(student.attendance[att].date).diff(this.start, 'days') % 7
            var weeks   = moment(student.attendance[att].date).diff(this.start, 'weeks')

            console.log(student, student.attendance[att].date, days, weeks)

            if (!(weeks in student.attendenceFormatted)) {
                student.attendenceFormatted[weeks] = {}
            }
            if (moment(student.attendance[att].date).hours() < 9 || (moment(student.attendance[att].date).hours() === 9 && moment(student.attendance[att].date).minutes() <= 15)) {
                student.attendenceFormatted[weeks][days] = 1
            } else {
                student.attendenceFormatted[weeks][days] = 0
            }
        }
      },
      refresh : function () {
        this.currentData = this.getWeek()
        //Get the principal user
        sePrincipal.identity().then( function(data){
            $scope.ctrl.user = data

            if ($scope.ctrl.user.role < 4) {
                $scope.ctrl.students = [$scope.ctrl.user]
                $scope.ctrl.organizeAtt($scope.ctrl.students[0])
                $rootScope.loading = false
            } else {
                //Get all the other users
                sePrincipal.userList().then( function(data) {
                    console.log(data)
                    //If the user is a student and not a test
                    $scope.ctrl.students = _.filter(data, function(dat){
                        return dat.role < 4 && dat.role > 0
                    })
                    //here we have to take the hasAttr for each attendance
                    for (var student in $scope.ctrl.students) {
                        $scope.ctrl.organizeAtt($scope.ctrl.students[student])
                    }
                    $scope.ctrl.teachers = _.filter(data, function(dat){ return dat.role >= 4 })
                    $rootScope.loading = false
                })
            }
        })
      }
    }

    $scope.ctrl.refresh()
}])
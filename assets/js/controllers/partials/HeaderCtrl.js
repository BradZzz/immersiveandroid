angular.module('ambrosia').controller('HeaderCtrl', function ($scope, $timeout, $mdSidenav, $log)
{

  $scope.ctrl = {
    test : {
        image : 'assets/img/test/test_user.png',
        name : 'Geoff Test',
        email : 'geoffrey.test@gmail.com',
    },
    nav : [
        { icon : 'ion-android-home', text : 'Profile', click : function(){console.log("clicked home")} },
        { icon : 'ion-ios-pulse-strong', text : 'Analytics', click : function(){console.log("clicked analytics")} },
        { icon : 'ion-ios-gear', text : 'Settings', click : function(){console.log("clicked settings")} },
        { icon : 'ion-android-exit', text : 'Logout', click : function(){console.log("clicked logout")} },
    ],
    backgrounds : ['assets/img/backgrounds/wall_1.png','assets/img/backgrounds/wall_2.png',
        'assets/img/backgrounds/wall_3.png','assets/img/backgrounds/wall_4.png',]
  }

  $scope.toggleRight = buildToggler('left')

  $scope.isOpenRight = function(){
    return $mdSidenav('left').isOpen()
  }
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }, 200);
  }
  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }
  }
}).controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close left is done");
        });
    };
});
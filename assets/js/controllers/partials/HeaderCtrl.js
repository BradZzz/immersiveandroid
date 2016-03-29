angular.module('ambrosia').controller('HeaderCtrl',
['$scope', '$state', '$rootScope', '$timeout', '$mdSidenav', '$log', 'seQuotes', 'seUser', 'seTheme',
function ($scope, $state, $rootScope, $timeout, $mdSidenav, $log, seQuotes, seUser, seTheme)
{

  //var id = Flash.create('success', message)
  // First argument (string) is the type of the flash alert.
  // Second argument (string) is the message displays in the flash alert (HTML is ok).
  // Third argument (number, optional) is the duration of showing the flash. 0 to not automatically hide flash
  // (user needs to click the cross on top-right corner).
  // Fourth argument (object, optional) is the custom class and id to be added for the flash message created.
  // Fifth argument (boolean, optional) is the visibility of close button for this flash.
  // Returns the unique id of flash message that can be used to call Flash.dismiss(id); to dismiss the flash message.

  $scope.loginRegister = {
    isLoggingIn : true,
    loggedIn : seUser.loggedIn,
    logForm : { username : '', password : '', active : false },
    test : seUser.getUser(),
    register : function () {
        console.log(this)
        if (this.isLoggingIn) {
            this.isLoggingIn = false
        } else {
            console.log(arguments)
            seUser.register.apply(this, arguments)
        }
    },
    login : function () {
        console.log(this)
        if (!this.isLoggingIn) {
            this.isLoggingIn = true
        } else {
            console.log(arguments)
            seUser.login.apply(this, arguments)
        }
    },
    refresh : function () {
        $rootScope.safeApply(function () {
            $scope.loginRegister.test = seUser.getUser()
            $scope.loginRegister.loggedIn = seUser.loggedIn
        })
    },
  }

  $scope.ctrl = {
    simulateQuery : false,
    isDisabled : false,
    states : [],
    querySearch : function (query) {
        if (query) {
            return _.filter($scope.ctrl.states, function(tick){ return tick.value.substring(0, query.length) == query }).splice(0, 15)
        } else {
            return []
        }
    },
    selectedItemChange : function (item) {
        if (item && 'value' in item) {
          $state.go('stock', { ticker: item.value.toUpperCase() })
        }
    },
    searchTextChange : function (text) {
      console.log('Text changed to ' + text);
    },
    newState : function (state) {
      alert("Sorry! You'll need to create a Constituion for " + state + " first!");
    },
    nav : [
        { icon : 'ion-android-home', text : 'Home', click : function(){$state.go('home')} },
        { icon : 'ion-folder', text : 'Profile', click : function(){$state.go('profile')} },
        { icon : 'ion-ios-pulse-strong', text : 'Analytics', click : function(){console.log("clicked analytics")} },
        { icon : 'ion-ios-gear', text : 'Settings', click : function(){console.log("clicked settings")} },
        { icon : 'ion-android-exit', text : 'Logout', click : function(){seUser.logout($scope.loginRegister.refresh)} },
    ],
    incBackground : function (offset) {
        if ($scope.loginRegister.test.background + offset > this.backgrounds.length - 1 ) {
            $scope.loginRegister.test.background = 0
        } else if ($scope.loginRegister.test.background + offset < 0 ) {
            $scope.loginRegister.test.background = this.backgrounds.length - 1
        } else {
            $scope.loginRegister.test.background += offset
        }
    },
    backgrounds : seTheme.backgrounds,
  }

  $scope.$on('update', function () {
    $scope.loginRegister.refresh()
  })

  //This runs once when the user refreshes the browser
  seUser.recover(function(data){
      $scope.loginRegister.refresh()
  })

  seQuotes.getTestList().then(function(response){
      var tickers = _.map(response, function(num){ return num })
      $scope.ctrl.states = _.map( _.sortBy( tickers, function( tick ){ return tick }) , function (tick) {
         return {
           value: tick.ticker.toLowerCase(),
           display: tick.ticker
         }
      })

      console.log(tickers.length)
  })

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
}]).controller('LeftCtrl',
['$scope', '$timeout', '$mdSidenav', '$log',
function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close left is done");
        });
    };
}]);
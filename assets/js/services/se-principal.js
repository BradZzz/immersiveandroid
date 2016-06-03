angular.module('ambrosia').service('sePrincipal',
['$q', '$http', '$rootScope', 'Flash',
function ($q, $http, $rootScope, Flash)
{
  var _authenticated = false

  var _identity = unknown_user = {
    photo : 'assets/img/test/test_logged_out.png',
    name : 'Logged Out',
    email : '',
    gender : '',
    address1 : '',
    address2 : '',
    city : '',
    state : '',
    zip : 00000,
    background : 7,
    fake : true,
  }

  var storageIndex = "hopShares.identity"

  return {
    isIdentityResolved: function() {
      return !('fake' in _identity)
    },
    isAuthenticated: function() {
      console.log(_identity, _authenticated)
      return _authenticated;
    },
    isInRole: function(role) {

      if (!_authenticated || !_identity.role) {
        return false
      }
      return _identity.role >= role
    },
    isInAnyRole: function(role) {
      if (!_authenticated || !_identity.role) {
        return false
      }
      return true
    },
    authenticate: function(identity) {
      _identity = identity
      _authenticated = identity != null

      if (identity) {
        localStorage.setItem(storageIndex, angular.toJson(identity))
      } else {
        localStorage.removeItem(storageIndex)
      }
    },
    register: function (username, password, type) {
       var deferred = $q.defer()
       $http({
         url: '/register',
         method: "POST",
         data: {
           email : username,
           pass : password,
           type : type,
         },
         headers: {
           'Content-Type': 'application/json'
         }
       }).then(function(res) {
         var data = res.data.user
         //_identity = data
         //_authenticated = true
         Flash.create('success', 'User Registered')
         $rootScope.$broadcast('update')
         //deferred.resolve(_identity)
         deferred.resolve(data)
       }, function(err){
         console.log('Error!')
         console.log(err)
         Flash.create('danger', err)
         deferred.reject(err)
       })
       return deferred.promise
    },
    login: function (username, password, type) {
      var deferred = $q.defer()
      $http({
        url: '/login',
        method: "POST",
        params: {
            username : username,
            password : password,
            type : type,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(res) {
        var data = res.data.user
        console.log('Success!', data)
        _identity = data
        _authenticated = true
        $rootScope.$broadcast('update')
        deferred.resolve(_identity)
      }, function(err){
        console.log('Error!')
        console.log(err)
        deferred.reject(err)
      })
      return deferred.promise
    },
    update: function (user) {
      var deferred = $q.defer()
      $http({
        url: '/updateUser',
        method: "POST",
        params: {
          user : user
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(res) {
        console.log(res)
        var data = res.data.user
        _identity = data
        _authenticated = true
        Flash.create('success', 'User Updated')
        $rootScope.$broadcast('update')
        deferred.resolve(_identity)
      }, function(err){
          console.log('Error!')
          console.log(err)
          Flash.create('danger', err.data.err)
          deferred.reject(err)
      })
      return deferred.promise
    },
    logout: function (callback) {
      var deferred = $q.defer()
      $http({
        url: '/logout',
        method: 'GET',
      }).then(function (res) {
        console.log(res)
        _identity = unknown_user
        _authenticated = false
        $rootScope.$broadcast('update')
        deferred.resolve(_identity)
      })
      return deferred.promise
    },
    identity: function(force) {
      var deferred = $q.defer()
      if (force === true) {
        _identity = undefined
      }
      //Check if the identity is in the service
      if (angular.isDefined(_identity) && _identity != null) {
        console.log('isDefined')
        console.log(_identity)
        deferred.resolve(_identity)
      //Check to see if the identity is in the local storage
      } else if (storageIndex in localStorage) {
        console.log('storageIndex')
        console.log(_identity)
        _identity = angular.fromJson(localStorage.getItem(storageIndex))
        self.authenticate(_identity)
        deferred.resolve(_identity)
      //Check to see if the identity is in the server session
      } else {
        $http({
          url: '/recover',
          method: 'GET',
        }).then(function (res) {
          var data = res.data.user
          _identity = data
          _authenticated = true
          console.log('http')
          console.log(_identity)
          $rootScope.$broadcast('update')
          deferred.resolve(_identity)
        }, function(err){
          console.log('Error!')
          console.log(err)
          _identity = unknown_user
          _authenticated = false
          deferred.resolve(_identity)
        })
      }
      return deferred.promise
    }
  }

}])

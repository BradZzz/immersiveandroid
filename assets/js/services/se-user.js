angular.module('ambrosia').service('seUser',
['$http',
function ($http)
{
  var self = this
  self.logName = 'seUser'

  self.unknown_user = {
      image : 'assets/img/test/test_logged_out.png',
      name : 'Logged Out',
      email : '',
      gender : '',
      address1 : '',
      address2 : '',
      city : '',
      state : '',
      zip : 00000,
      background : 7,
  }

  self.user = {
      image : 'assets/img/test/test_user.png',
      name : 'Geoff Test',
      email : 'geoffrey.test@gmail.com',
      gender : 'M',
      address1 : '1201 Awesome Ave',
      address2 : '#108',
      city : 'Beverly Hills',
      state : 'CA',
      zip : 90210,
      background : 7,
  }

  self.register = function (username, password, type, callback) {

       console.log('logging in...')

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
         console.log('Success!')
         console.log(res)
         self.loggedIn = true
         callback()
       }, function(err){
         console.log('Error!')
         console.log(err)
         self.loggedIn = false
       })
    }

  self.login = function (username, password, type, callback) {

     console.log('logging in...')

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
       console.log('Success!')
       console.log(res)
       self.loggedIn = true
       callback()
     }, function(err){
       console.log('Error!')
       console.log(err)
       self.loggedIn = false
     })
  }

  self.logout = function () {
    $http({
      url: '/logout',
      method: 'GET',
    }).then(function (response) {
      console.log(response)
      self.loggedIn = false
    })
  }

  self.loggedIn = false

  self.getUser = function(){
    if (self.loggedIn) {
        return self.user
    } else {
        return self.unknown_user
    }
  }

  self.print = function (response) {
    console.log(self.logName + " response: ", response)
  }

}]);

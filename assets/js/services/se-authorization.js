angular.module('ambrosia').service('seAuthorization',
['$rootScope', '$state', 'sePrincipal',
function ($rootScope, $state, sePrincipal)
{
  return {
    authorize: function() {
      return sePrincipal.identity()
        .then(function() {
          var isAuthenticated = sePrincipal.isAuthenticated()
          if ('data' in $rootScope.toState && 'role' in $rootScope.toState.data && !sePrincipal.isInRole($rootScope.toState.data.role)) {
            if (isAuthenticated) {
              $state.go('home') // user is signed in but not authorized for desired state
            } else {
              // user is not authenticated. stow the state they wanted before you
              // send them to the signin state, so you can return them when you're done
              $rootScope.returnToState = $rootScope.toState
              $rootScope.returnToStateParams = $rootScope.toStateParams
              // now, send them to the signin state so they can log in
              $state.go('home')
            }
          }
        })
    }
  }
}])

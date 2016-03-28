/*! Angular application initialization */

var modules = [
  'ngAnimate',
  'ngMaterial',
  'ui.router',
  'angular-loading-bar',
  'ui.bootstrap',
]

var role = {
    'all' : 0,
    'user' : 1,
    'admin' : 2,
    'super' : 3,
}

var app = angular.module('ambrosia', modules)

app.config(
['$locationProvider', '$stateProvider', '$urlRouterProvider',
function ($locationProvider, $stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/")

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "/assets/html/home/main.html",
      controller: "MainCtrl"
    })
    .state('stock', {
      url: "/stockui?ticker",
      templateUrl: "/assets/html/home/stock.html",
      controller: "StockCtrl"
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "/assets/html/home/profile.html",
      controller: "ProfileCtrl"
    })

  $locationProvider.html5Mode(true)
}])

app.run(
['$rootScope',
function ($rootScope) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    console.log("state", toState, toParams, fromState, fromParams)
  })
}]);

app.config(['$mdThemingProvider',
function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange')
    .backgroundPalette('grey', {
      'default': '50',
      'hue-1': '100',
      'hue-2': '100',
      'hue-3': '200'
    })
}]);

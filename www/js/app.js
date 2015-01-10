var souritpApp = angular.module('souritpApp', [
  'ngRoute',
  'souritpControllers'
]);

souritpApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/welcome', {
        templateUrl: 'partials/welcome.html',
        controller: 'WelcomeCtrl'
      }).
      when('/HomeWork', {
        templateUrl: 'partials/timetable.html',
        controller: 'HomeWorkCtrl'
      }).
      when('/WorkHome', {
        templateUrl: 'partials/timetable.html',
        controller: 'WorkHomeCtrl'
      }).
      when('/HomeTown', {
        templateUrl: 'partials/timetable.html',
        controller: 'HomeTownCtrl'
      }).
      when('/TownHome', {
        templateUrl: 'partials/timetable.html',
        controller: 'TownHomeCtrl'
      }).
      when('/HomeRER', {
        templateUrl: 'partials/timetable.html',
        controller: 'HomeRERCtrl'
      }).
      when('/RERHome', {
        templateUrl: 'partials/timetable.html',
        controller: 'RERHomeCtrl'
      }).
      otherwise({
        redirectTo: '/welcome'
      });
  }]);

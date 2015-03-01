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
      when('/ShowRoute/:RouteID', {
        templateUrl: 'partials/timetable.html',
        controller: 'ShowRouteCtrl'
      }).
      when('/AddRoute', {
        templateUrl: 'partials/add_route.html',
        controller: 'AddRouteCtrl'
      }).
      otherwise({
        redirectTo: '/welcome'
      });
  }]);

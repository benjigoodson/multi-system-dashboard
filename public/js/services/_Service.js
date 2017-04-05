var underscore = angular.module('underscore', []);

underscore.factory('_', ['$window', function($window) {
  // assumes underscore has already been loaded on the page
  // returnns the underscore library so it can be used within angular
  return $window._; 
}]);
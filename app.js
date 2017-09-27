// MODULES
var weatherForcastApp = angular.module('weatherForcastApp', ['ngRoute']);

weatherForcastApp.config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl:'templates/main.html',
    controller: 'mainController'
  }).when('/forcast', {
    templateUrl:'templates/forcast.html',
    controller: 'forcastController'
  });
});

// SERVICES
weatherForcastApp.service('cityService', function(){
  this.city = "Delhi, DL";
});

// CONTROLLERS
weatherForcastApp.controller('mainController',['$scope', '$location', 'cityService', function($scope, $location, cityService){
  $scope.city = cityService.city;

  $scope.submitForm = function(){
    $location.url("/forcast");
  };

  $scope.$watch('city', function(){
    cityService.city = $scope.city;
  });
  
}]);
weatherForcastApp.controller('forcastController',['$scope', 'cityService', function($scope, cityService){
  $scope.city = cityService.city;

}]);


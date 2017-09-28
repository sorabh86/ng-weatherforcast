// MODULES
var weatherForcastApp = angular.module('weatherForcastApp', ['ngRoute', 'ngResource']);

weatherForcastApp.config(function($routeProvider, $sceDelegateProvider){
  $routeProvider.when('/', {
    templateUrl:'templates/main.html',
    controller: 'mainController'
  }).when('/forcast', {
    templateUrl:'templates/forcast.html',
    controller: 'forcastController'
  }).when('/forcast/:days', {
    templateUrl:'templates/forcast.html',
    controller:'forcastController'
  });

  // $sceProvider.enabled(false);
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://api.openweathermap.org/data/2.5/forecast**'
  ]);
  
  // The blacklist overrides the whitelist so the open redirect here is blocked.
  $sceDelegateProvider.resourceUrlBlacklist([
    'http://myapp.example.com/clickThru**'
  ]);
  // console.log('sceProvider',$sceProvider);
});

// SERVICES
weatherForcastApp.service('gModel', function(){
  this.appId = "c629423cb43b0934aee9e92f67866836";
  this.city = "Delhi, IN";
  this.url = "http://api.openweathermap.org/data/2.5/forecast/";
});
weatherForcastApp.service('weatherService', function($resource,gModel){
  this.getWeather = function(appId, city, days) {
    var weatherAPI = $resource(gModel.url, { get:{ method:'JSONP' } });
    return weatherAPI.get({appid:appId, q:city, cnt:days});
  };
});

// DIRECTIVES
weatherForcastApp.directive("forcastElement",function(){
  return {
    restrict : "E",
    templateUrl:"directives/forcast-element.html",
    replace: true,
    scope: {
      weatherObj:"=",
      convertDate:"&",
      convertCelsius:"&",
      convertFahrenheit:"&"
    }
  };
});

// CONTROLLERS
weatherForcastApp.controller('mainController',['$scope', '$location', 'gModel', function($scope, $location, gModel){
  $scope.city = gModel.city;

  $scope.submitForm = function(){
    $location.url("/forcast");
  };

  $scope.$watch('city', function(){
    gModel.city = $scope.city;
  });
  
}]);
weatherForcastApp.controller('forcastController',['$scope', '$routeParams', 'gModel', 'weatherService',
  function($scope, $routeParams, gModel, weatherService){
  $scope.city = gModel.city;
  $scope.days = $routeParams.days || 2;

  $scope.weatherResult = weatherService.getWeather(gModel.appId, $scope.city, $scope.days);
  
  $scope.convertToDate = function(dt){
    return new Date(dt*1000);
  };
  $scope.kelvin2Celsius = function(kel) {
    return (kel - 273.15).toFixed(2);
  };
  $scope.kelvin2Fahrenheit = function(kel) {
    return (((kel-273.15)*1.8)+32).toFixed(2);
  }
}]);


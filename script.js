 // create the module and name it citibikeApp
        // also include ngRoute for all our routing needs
        var citibikeApp = angular.module('citibikeApp', ['ngRoute']);

        // configure our routes
        citibikeApp.config(function($routeProvider) {
            $routeProvider
                // route for the search page
                .when('/search', {
                    templateUrl : 'pages/search.html',
                    controller  : 'searchController'
                })
                .otherwise({redirectTo : '/'});
               
        });
    
       
    
        citibikeApp.controller('searchController', function($scope) {
            $scope.message = 'Look! I am an searchController page.';
        });
    
       
    
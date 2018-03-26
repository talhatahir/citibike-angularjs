var citibikeApp = angular.module('citibikeApp');
citibikeApp.factory('jsonService', function($http) {

    var getData = function(url) {   
        // Angular $http() and then() both return promises themselves 
        return $http.get(url).then(function(result){        
            // What we return here is the data that will be accessible 
            // to us after the promise resolves
            return result.data.data.stations;
        });
    };        

    return { getData: getData };
});
var citibikeApp = angular.module('citibikeApp');
citibikeApp.service('stationInfoService',['$http', '$rootScope', function($http,$rootScope) {

    var getData = function(url) {   
        // Angular $http() and then() both return promises themselves 
        return $http.get(url).then(function(result){        
            // What we return here is the data that will be accessible 
            // to us after the promise resolves
            return result.data.data.stations;
        }).catch(function(result) {
            console.error('Something went wrong', result.data);
          });
    };        

    return { getData: getData };
}]);
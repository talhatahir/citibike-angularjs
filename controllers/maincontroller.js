var citibikeApp = angular.module('citibikeApp');
 // create the controller and inject Angular's $scope
 citibikeApp.controller('mainController', ['$scope','$http','$q','stationInfoService',function($scope,$http,$q,stationInfoService) {    

    
    var resArr=[];    
    $scope.markers = [];
    $scope.geonames = [];
        
    //init Maps for use
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(40.76727216,-73.99392888),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);    

    //prepare call for fetchin data from both jsons
    var myDataPromise1 = stationInfoService.getData("https://gbfs.citibikenyc.com/gbfs/en/station_information.json");
    var myDataPromise2 = stationInfoService.getData("https://gbfs.citibikenyc.com/gbfs/en/station_status.json");

    //using promises to get data back when its available
    var combinedData = $q.all({
        firstResponse: myDataPromise1,
        secondResponse: myDataPromise2
      });


    combinedData.then(function(response) {     
    var stInf=[];
    stInf=response.firstResponse;

    var stStat=[];
    stStat=response.secondResponse;

    var pctAge=[]; //saving computed percentage for use in charts   
    
    //Array for map icons
    var mapIcons=["http://maps.google.com/mapfiles/ms/micons/orange.png","http://maps.google.com/mapfiles/ms/micons/red.png","http://maps.google.com/mapfiles/ms/micons/green.png"];

    
    for (i = 0; i < stInf.length; i++){
          
        var calcPcntage=parseInt((stStat[i].num_bikes_available) / ((stInf[i].capacity-stStat[i].num_bikes_disabled))*100);
        if(calcPcntage < 0) calcPcntage=0;
        pctAge.push(calcPcntage); 
        

        if(calcPcntage == 0){
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(stInf[i].lat, stInf[i].lon),
                title: stInf[i].name,
                icon:mapIcons[1],
                pcnt: calcPcntage,
                searchTag:stInf[i].name
            });    

        }else if(calcPcntage < 50){

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(stInf[i].lat, stInf[i].lon),
                title: stInf[i].name,
                icon:mapIcons[0],
                pcnt: calcPcntage,
                searchTag:stInf[i].name
            });

        }else{
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(stInf[i].lat, stInf[i].lon),
                title: stInf[i].name,
                icon:mapIcons[2],
                pcnt: calcPcntage,
                searchTag:stInf[i].name
            });

        }        
        
        //pushing google map markers in scope marker array
        $scope.markers.push(marker);

        //pushing station geo names in scope array
        $scope.geonames.push(stInf[i].name);
     
    }

    Highcharts.chart('container', {
        title: {
          text: 'Percentage of bikes available at each station'
        },
  
        xAxis: {
          categories: $scope.geonames,
          title: {
            text: 'Station Name'
            }
        },

        yAxis: {
            title: {
                text: '%age of Bikes being used'
            }
        },
  
        series: [{
          name: '% of Bike in use',
          data: pctAge
        }]
      });

       
    }); 
    
    $scope.searchMarker = function(){

        var foundQuery;

        if(($scope.searchVal=='' || $scope.searchVal==undefined) || ($scope.radius=='' || $scope.radius==undefined)){
            return;
        } 


        for(var i=0;i<$scope.markers.length;i++){
            if($scope.markers[i].title==$scope.searchVal){
                foundQuery=$scope.markers[i];
                break;
            }
        }

        for(var i=0;i<$scope.markers.length;i++){
            $scope.markers[i].setMap(null);
        }

        var radiusInm=parseFloat($scope.radius)*1000;
       
        var mapOptions = {
            zoom: 18,
            center: foundQuery.position,            
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }
        
       
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);   
      
        for(var i=0;i<$scope.markers.length;i++){  
            var dist=google.maps.geometry.spherical.computeDistanceBetween(foundQuery.position,$scope.markers[i].position);
            
            if(dist<=radiusInm){
                $scope.markers[i].setMap($scope.map);
                console.log(dist);
            }      
                
        }
        
    }

}]);
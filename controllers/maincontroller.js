var citibikeApp = angular.module('citibikeApp');
 // create the controller and inject Angular's $scope
 citibikeApp.controller('mainController', ['$scope','$http','$q','stationInfoService',function($scope,$http,$q,stationInfoService) {    

    
    var resArr=[];    
    $scope.markers = [];
    $scope.geonames = [];
    //setup chart        
    $scope.myJson = {
        globals: {
            shadow: false,
            fontFamily: "Verdana",
            fontWeight: "100"
        },
        type: "pie",
        backgroundColor: "#fff",

        legend: {
            layout: "x3",
            position: "50%",
            borderColor: "transparent",
            marker: {
                borderRadius: 7,
                borderColor: "transparent"
            }
        },
        tooltip: {
            text: "count = %v"
        },
        plot: {
            refAngle: "-90",
            borderWidth: "0px",
            valueBox: {
                placement: "in",
                text: "%npv %",
                fontSize: "15px",
                textAlpha: 1,
            }
        },
        series: [
              {
                values: [0],
                text: "Bikes Available"
          
              }, {
                values: [0],
                text: "Ebikes Available"
          
              }, {
                values: [0],
                text: "Bikes Disabled"
          
              }, {
                values: [6],
                text: "Docks Available"
          
              }, {
                values: [0],
                text: "Docks Disabled"
          
              }

        ]
    };

        
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

    //Get data from Promises
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
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(stInf[i].lat, stInf[i].lon),
            title: stInf[i].name,
            icon: (calcPcntage == 0) ? mapIcons[1] :(calcPcntage < 50) ? mapIcons[0] : mapIcons[2] ,
            num_bikes_available:stStat[i].num_bikes_available,
            num_ebikes_available:stStat[i].num_ebikes_available,
            num_bikes_disabled:stStat[i].num_bikes_disabled,
            num_docks_available:stStat[i].num_docks_available,
            num_docks_disabled:stStat[i].num_docks_available
        });


        //pushing google map markers in scope marker array
        $scope.markers.push(marker);
        //pushing station geo names in scope array
        $scope.geonames.push(stInf[i].name);
        
       
     
    }

    $scope.initChart();
       
    }); 

    //initChart
    $scope.initChart = function(){

        var totalBikesAvailable=0;
        var totalEbikesAvailable=0;
        var totalBikesDisabled=0;
        var totalDocksAvailable=0;
        var totalDocksDisabled=0;

        for(var i=0; i<$scope.markers.length;i++){
            totalBikesAvailable+=$scope.markers[i].num_bikes_available;
            totalEbikesAvailable+=$scope.markers[i].num_ebikes_available;
            totalBikesDisabled+=$scope.markers[i].num_bikes_disabled;
            totalDocksAvailable+=$scope.markers[i].num_docks_available;
            totalDocksDisabled+=$scope.markers[i].num_docks_disabled;
        }

        $scope.myJson.series[0].values.pop();
        $scope.myJson.series[0].values.push(totalBikesAvailable);

        $scope.myJson.series[1].values.pop();
        $scope.myJson.series[1].values.push(totalEbikesAvailable);

        $scope.myJson.series[2].values.pop();
        $scope.myJson.series[2].values.push(totalBikesDisabled);

        $scope.myJson.series[3].values.pop();
        $scope.myJson.series[3].values.push(totalDocksAvailable);

        $scope.myJson.series[4].values.pop();
        $scope.myJson.series[4].values.push(totalDocksDisabled);
       

    }

    
    //searchMarker on Google Map with Radius and Station Name
    $scope.searchMarker = function(){

        var foundQuery;

        if(($scope.searchVal=='' || $scope.searchVal==undefined) || ($scope.radius=='' || $scope.radius==undefined)){
            return;
        } 


        foundQuery=$scope.searchQueryMarker($scope.searchVal);


        for(var i=0;i<$scope.markers.length;i++){
            $scope.markers[i].setMap(null);
        }

        var radiusInm=parseFloat($scope.radius)*1000;
       
        var mapOptions = {
            zoom: 15,
            center: foundQuery.position,            
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }
        
       
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);   
      
        for(var i=0;i<$scope.markers.length;i++){  
            var dist=google.maps.geometry.spherical.computeDistanceBetween(foundQuery.position,$scope.markers[i].position);
            
            if(dist<=radiusInm){
                $scope.markers[i].setMap($scope.map);
                
            }      
                
        }
        
    }
    //Function to query a value in $scope.markers
    $scope.searchQueryMarker=function(searchKey){

        for(var i=0;i<$scope.markers.length;i++){
            if($scope.markers[i].title== searchKey){                 
                return $scope.markers[i];
            }
        }
        
        return 0;

    }
    //Show station specifc chart data
    $scope.showChartData=function(){

        var foundQuery;

        if($scope.searchStation=='' || $scope.searchStation==undefined){
            $scope.initChart();
            return;
        }

        foundQuery=$scope.searchQueryMarker($scope.searchStation);  

        $scope.myJson.series[0].values.pop();
        $scope.myJson.series[0].values.push(foundQuery.num_bikes_available);

        $scope.myJson.series[1].values.pop();
        $scope.myJson.series[1].values.push(foundQuery.num_ebikes_available);

        $scope.myJson.series[2].values.pop();
        $scope.myJson.series[2].values.push(foundQuery.num_bikes_disabled);

        $scope.myJson.series[3].values.pop();
        $scope.myJson.series[3].values.push(foundQuery.num_docks_available);

        $scope.myJson.series[4].values.pop();
        $scope.myJson.series[4].values.push(foundQuery.num_docks_disabled);


    }

    


}]);
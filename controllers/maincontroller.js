var citibikeApp = angular.module('citibikeApp');
 // create the controller and inject Angular's $scope
 citibikeApp.controller('mainController', function($scope,$http,$q,jsonService) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how goodss I mainController!';
    var resArr=[];
    // var pa = [];
    // var paPromise = $q.defer();

    // $http.get('https://gbfs.citibikenyc.com/gbfs/en/station_information.json').success(function(response) {
    //     pa= response.data.stations;
    //     //console.log(this.resArr);
    //     paPromise.resolve(pa);
    //  });

    //  $scope.myData = paPromise.promise;

               
    
    $scope.markers = [];

    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(40.76727216,-73.99392888),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    var myDataPromise1 = jsonService.getData("https://gbfs.citibikenyc.com/gbfs/en/station_information.json");
    var myDataPromise2 = jsonService.getData("https://gbfs.citibikenyc.com/gbfs/en/station_status.json");
    
    var combinedData = $q.all({
        firstResponse: myDataPromise1,
        secondResponse: myDataPromise2
      });

    combinedData.then(function(response) {
        console.log(response.firstResponse);
        console.log(response.secondResponse);                

    var stInf=[];
    stInf=response.firstResponse;

    var stStat=[];
    stStat=response.secondResponse;

    var pctAge=[];
    var stName=[];
      
    var mapIcons=["http://maps.google.com/mapfiles/ms/micons/orange.png","http://maps.google.com/mapfiles/ms/micons/red.png","http://maps.google.com/mapfiles/ms/micons/green.png"];

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);           

    var infoWindow = new google.maps.InfoWindow();
      
    for (i = 0; i < stInf.length; i++){
          
        var calcPcntage=parseInt((stStat[i].num_bikes_available) / ((stInf[i].capacity-stStat[i].num_bikes_disabled))*100);
        if(calcPcntage < 0) calcPcntage=0;
        console.log(calcPcntage);
        pctAge.push(calcPcntage);
        stName.push(stInf[i].name);

        if(calcPcntage == 0){

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(stInf[i].lat, stInf[i].lon),
                title: stInf[i].name,
                icon:mapIcons[1],
                pcnt: calcPcntage
            });    

        }else if(calcPcntage < 50){

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(stInf[i].lat, stInf[i].lon),
                title: stInf[i].name,
                icon:mapIcons[0],
                pcnt: calcPcntage
            });

        }else{
            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(stInf[i].lat, stInf[i].lon),
                title: stInf[i].name,
                icon:mapIcons[2],
                pcnt: calcPcntage
            });

        }
        
        //marker.content = '<div class="infoWindowContent">' + resArr[i].name + '</div>';                
        // google.maps.event.addListener(marker, 'click', function(){
        //     infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
        //     infoWindow.open($scope.map, marker);
        // });
        
        $scope.markers.push(marker);
     
    }

    Highcharts.chart('container', {
        title: {
          text: 'Percentage of bikes available at each station'
        },
  
        xAxis: {
          categories: stName
        },
  
        series: [{
          data: pctAge
        }]
      });

       console.log($scope.markers);
    });   
   
    // $scope.openInfoWindow = function(e, selectedMarker){
    //     e.preventDefault();
    //     google.maps.event.trigger(selectedMarker, 'click');
    // }            

});
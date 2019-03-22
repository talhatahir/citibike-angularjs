# citibike-angularjs

This demonstration project pulls data from https://gbfs.citibikenyc.com/gbfs/en/station_information.json which provides NewYork city's Paid bike service data.

The goal of this project was to pull different types of data from their various endpoints in JSON format and use it to make a Dashboard.
The Dashboard showed data in various formats:
1) Interactive Google Maps where you can see the density of the number of free/available bikes.
2) Specify a radius and show all the bike stations with their appropriate density marker( All bikes available, Some bikes available, No bikes available)
3) Show all stations on a specific Zoom levle of Google Maps.
4) Show chart data of a specific station.


## How to run:
Step 1
Download the zip file.

Step 2
1. install the following  npm package : npm install http-server -g
2. open cmd
3. cd to the citibike-ang folder
4. in cmd , type : http-server -o 
5. the application would open in a new browser window

OR you can use any local server to run this application.

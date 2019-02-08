mapboxgl.accessToken = 'pk.eyJ1IjoidGFtaXJwIiwiYSI6ImNqNmtvcjBieTFtOGgzMm52NWQ1Nnc1NTkifQ.CxOvrXtNgryGkkgXkiShsQ';

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/tamirp/cjrw716rl22gm1foe5p28gaap',
center: [-103.59179687498357, 40.66995747013945],
zoom: 3
});
var allMetrics = [{"label": "how long users lasted","dataName": "avg_visit_duration"},{"label": "how many videos per session were watched","dataName": "pages_per_visit"},{"label": "how many visits","dataName": "estimated_visits"},{"label": "how many unique visits","dataName": "estimated_unique"}]
var allSites = [{"label": "pornhub","dataName": "pornhub.com"},{"label": "xhamster","dataName": "xhamster.com"},{"label": "xnxx","dataName": "xnxx.com"},{"label": "xvideos","dataName": "xvideos.com"}]
var allDevices = [{"label": "desktop","dataName": "desktop"},{"label": "mobile web","dataName": "mobileweb"},{"label": "all traffic","dataName": "total"}]
var allDates = [{"label": "march 2018","dataName": "2018-03"},{"label": "april 2018","dataName": "2018-04"},{"label": "may 2018","dataName": "2018-05"},{"label": "june 2018","dataName": "2018-06"},{"label": "july 2018","dataName": "2018-07"},{"label": "august 2018","dataName": "2018-08"},{"label": "september 2018","dataName": "2018-09"},{"label": "october 2018","dataName": "2018-10"},{"label": "november 2018","dataName": "2018-11"}]


var App = angular.module('PDATA', ['ngAnimate']);
App.controller('index', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.currDomain = allSites[0];
  $scope.currDomainPos = 0;
  $scope.currDate = allDates[0];
  $scope.currDatePos = 0;
  $scope.currMetric = allMetrics[0];
  $scope.currMetricPos = 0;
  $scope.currDevice = allDevices[0];
  $scope.currDevicePos = 0;



map.on('style.load', function () { 
  
  
 })


 map.on('mousedown', function(e) {
  var target = map.queryRenderedFeatures(e.point, {
    layers: ['a']
  });
if (target[0]) {
  $scope.currCountry = target[0].properties.ADMIN;
  $scope.currValue = int.parseInt($scope.mapData[(target[0].properties.ISO_N3)]);
  $scope.$apply();
}
});


 $scope.nextClick = function(metric) {

  if (metric=="metric")
  {
    $scope.currMetricPos++;
    if ($scope.currMetricPos == allMetrics.length) {$scope.currMetricPos = 0; }
    $scope.currMetric =  allMetrics[$scope.currMetricPos];  
  }

  if (metric=="device")
  {
    $scope.currDevicePos++;
    if ($scope.currDevicePos == allDevices.length) {$scope.currDevicePos = 0; }
    $scope.currDevice =  allDevices[$scope.currDevicePos];  
  }

  if (metric=="domain")
  {
    $scope.currDomainPos++;
    if ($scope.currDomainPos == allSites.length) {$scope.currDomainPos = 0; }
    $scope.currDomain =  allSites[$scope.currDomainPos];  
  }

  if (metric=="date")
  {
    $scope.currDatePos++;
    if ($scope.currDatePos == allDates.length) {$scope.currDatePos = 0; }
    $scope.currDate =  allDates[$scope.currDatePos];  
  }
 

  $scope.drawmap();
 }
  $scope.drawmap = function() {
    // console.log(getData($scope.currDomain, $scope.currDate, $scope.currMetric, $scope.currDevice));
    $scope.mapData = getData($scope.currDomain.dataName, $scope.currDate.dataName, $scope.currMetric.dataName, $scope.currDevice.dataName);
 
    var expression = ["match", ["get", "ISO_N3"]];
   // Calculate color for each state based on the unemployment rate


   for (var key in $scope.mapData) {
    if ($scope.mapData.hasOwnProperty(key)) { 
      var currValue = ($scope.mapData[key] / $scope.mapData["maxValue"]);
      var color = chroma.mix("#fff", '#E6648F', currValue,'lab').hex();
      expression.push(key, color);
    }
}
   expression.push("rgba(0,0,0,0)");
    
  map.setPaintProperty('a', 'fill-color', expression);
   
 
  };
}]);


var getCountryName = [];
for (var j = 0; j < allCountries.length; j++) {
  getCountryName[parseInt(allCountries[j]["country-code"])] = allCountries[j]["name"];
}

function getData(domain, date, metric, device) {
  var returnArr = {};
  var currMetric = device + "_" + metric;
  var maxValue = 0;
  for (var i = 0; i < allData.length; i++) {
    if (allData[i].site == domain && allData[i].yearmonth == date && allData[i][currMetric]) {
      // console.log('country' + getCountryName[allData[i].country] + " is " + allData[i][currMetric]);
     if (maxValue < allData[i][currMetric]) { maxValue= allData[i][currMetric];}
      returnArr[('000' + allData[i].country).substr(-3)] = allData[i][currMetric];
    }
  }
  returnArr['maxValue'] = maxValue
  return returnArr;
}

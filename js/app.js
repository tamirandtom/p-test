mapboxgl.accessToken = 'pk.eyJ1IjoidGFtaXJwIiwiYSI6ImNqNmtvcjBieTFtOGgzMm52NWQ1Nnc1NTkifQ.CxOvrXtNgryGkkgXkiShsQ';



var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/tamirp/cjrw716rl22gm1foe5p28gaap',
  center: [0.59179687498357, 0.66995747013945],
  zoom: 1.9
});


var allMetrics = [{
  "label": "how long users lasted 💦",
  "dataName": "avg_visit_duration"
}, {
  "label": "monthly sessions per users 🌡",
  "dataName": "avg_sessions_per_user"
}, {
  "label": "how many videos per session were watched 🏊🏻‍♂️",
  "dataName": "pages_per_visit"
}, {
  "label": "the ammount of visits 🗿",
  "dataName": "estimated_visits"
}, {
  "label": "the unique visits 💎",
  "dataName": "estimated_unique"
}]
var allSites = [{
  "label": "pornhub",
  "dataName": "pornhub.com"
}, {
  "label": "xhamster",
  "dataName": "xhamster.com"
}, {
  "label": "xnxx",
  "dataName": "xnxx.com"
}, {
  "label": "xvideos",
  "dataName": "xvideos.com"
}]
var allDevices = [{
  "label": "desktop 💻",
  "dataName": "desktop"
}, {
  "label": "mobile 📱",
  "dataName": "mobileweb"
}, {
  "label": "all traffic 🕹",
  "dataName": "total"
}]

var allDatesRanges = [{
  "label": "Winter 2018",
  "start": "2018-03",
  "end": "2018-05"
}, {
  "label": "Summer 2018",
  "start": "2018-06",
  "end": "2018-10"
}];
var allDates = [{
  "label": "march 2018",
  "dataName": "2018-03"
}, {
  "label": "april 2018",
  "dataName": "2018-04"
}, {
  "label": "may 2018",
  "dataName": "2018-05"
}, {
  "label": "june 2018",
  "dataName": "2018-06"
}, {
  "label": "july 2018",
  "dataName": "2018-07"
}, {
  "label": "august 2018",
  "dataName": "2018-08"
}, {
  "label": "september 2018",
  "dataName": "2018-09"
}, {
  "label": "october 2018",
  "dataName": "2018-10"
}, {
  "label": "november 2018",
  "dataName": "2018-11"
}]

// add metric!

for (var i = 0; i < allData.length; i++) {
  allData[i].desktop_avg_sessions_per_user = allData[i].desktop_estimated_visits / allData[i].desktop_estimated_unique;

  if (allData[i].total_estimated_unique == 0 || allData[i].mobileweb_estimated_unique == 0) {
    allData[i].mobileweb_avg_sessions_per_user = 0;
    allData[i].total_avg_sessions_per_user = 0;

  } else {
    allData[i].mobileweb_avg_sessions_per_user = allData[i].mobileweb_estimated_visits / allData[i].mobileweb_estimated_unique;
    allData[i].total_avg_sessions_per_user = allData[i].total_estimated_visits / allData[i].total_estimated_unique;

  }
}


var App = angular.module('PDATA', ['ngAnimate']);
App.controller('index', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.currDomain = allSites[0];
  $scope.currDomainPos = 0;
  $scope.currDateRange = allDatesRanges[0];
  $scope.currDateRangePos = 0;
  $scope.currDate = allDates[0];
  $scope.currDatePos = 0;
  $scope.currMetric = allMetrics[0];
  $scope.currMetricPos = 0;
  $scope.currDevice = allDevices[0];
  $scope.currDevicePos = 0;



  map.on('style.load', function () {
    $scope.drawmap();
  })

  $scope.currCountryPercent = 50;
  $scope.toggleComparison = function() {
    $scope.toggleComparisonMode = !($scope.toggleComparisonMode);
    $scope.drawmap();
  }

  $scope.toggleComparisonMode = false;
  map.on("click", "a", function (e) {
    if (e.features.length > 0) {
      $scope.toggleComparisonMode = !($scope.toggleComparisonMode);
      $scope.toggleComparisonModeCountry = e.features[0].properties.ISO_N3;
      $scope.toggleComparisonModeCountryLabel = e.features[0].properties.BRK_NAME;
      // Draw map again with mode changed
      $scope.drawmap();
      }
      });

  map.on("mousemove", "a", function (e) {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState({
          source: 'composite',
          sourceLayer: 'ne_10m_admin_0_countries-d4tnsq',
          id: hoveredStateId
        }, {
          hover: false
        });
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState({
        source: 'composite',
        sourceLayer: 'ne_10m_admin_0_countries-d4tnsq',
        id: hoveredStateId
      }, {
        hover: true
      });

      $scope.currCountry = e.features[0].properties.ADMIN;
      if ($scope.mapData[(e.features[0].properties.ISO_N3)]) {
        if ($scope.currMetric.dataName == 'avg_visit_duration') {
          $scope.currValue = "" + fancyTimeFormat(parseInt($scope.mapData[(e.features[0].properties.ISO_N3)])) + " Mins";

        } else if ($scope.currMetric.dataName == 'pages_per_visit') {
          $scope.currValue = parseFloat($scope.mapData[(e.features[0].properties.ISO_N3)]).toFixed(1) + " Pages";

        } else if ($scope.currMetric.dataName == 'avg_sessions_per_user') {
          $scope.currValue = parseFloat($scope.mapData[(e.features[0].properties.ISO_N3)]).toFixed(1) + " Sessions";

        } else {
          $scope.currValue = nFormatter(parseInt($scope.mapData[(e.features[0].properties.ISO_N3)]));
        }
      } else {
        $scope.currValue = 0;
      }



      // set pointer on legend
      $scope.currLegendTop = (parseInt($scope.mapData[(e.features[0].properties.ISO_N3)]) - parseInt($scope.mapData['minValue'])) / (parseInt($scope.mapData['maxValue']) - parseInt($scope.mapData['minValue']));



      $scope.$apply();

    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "a", function () {
    if (hoveredStateId) {
      map.setFeatureState({
        source: 'composite',
        sourceLayer: 'ne_10m_admin_0_countries-d4tnsq',
        id: hoveredStateId
      }, {
        hover: false
      });
      $scope.currCountry = "";
      $scope.currValue = "";
      $scope.$apply();
    }

    hoveredStateId = null;
  });


  //  map.on('mousedown', function(e) {
  //   var target = map.queryRenderedFeatures(e.point, {
  //     layers: ['a']
  //   });
  // if (target[0]) {
  //  
  // }
  // });

  var hoveredStateId = null;

  $scope.nextClick = function (metric) {

    if (metric == "metric") {
      $scope.currMetricPos++;
      if ($scope.currMetricPos == allMetrics.length) {
        $scope.currMetricPos = 0;
      }
      $scope.currMetric = allMetrics[$scope.currMetricPos];
    }

    if (metric == "device") {
      $scope.currDevicePos++;
      if ($scope.currDevicePos == allDevices.length) {
        $scope.currDevicePos = 0;
      }
      $scope.currDevice = allDevices[$scope.currDevicePos];
    }

    if (metric == "domain") {
      $scope.currDomainPos++;
      if ($scope.currDomainPos == allSites.length) {
        $scope.currDomainPos = 0;
      }
      $scope.currDomain = allSites[$scope.currDomainPos];
    }

    if (metric == "date") {
      $scope.currDateRangePos++;
      if ($scope.currDateRangePos == allDatesRanges.length) {
        $scope.currDateRangePos = 0;
      }
      $scope.currDateRange = allDatesRanges[$scope.currDateRangePos];
    }


    $scope.drawmap();
  }


  $scope.drawmap = function () {

  
    var colorScale = chroma.scale(['#FFD9E6', '#E6648F', '#C6446F', '#8B304F']).correctLightness();
    var colorScaleComparePos = chroma.scale(['#eee','#A5FEE3','#82F0CF','#49E1B3','#1EC794','#13A77A']).correctLightness();
    var colorScaleCompareNeg = chroma.scale(['#BB3F3F','#F26F6F','#FE9292','#FFC9C9','#FFE6E6','#eee']).correctLightness();
    // console.log(colorScale);
    // console.log(getData($scope.currDomain, $scope.currDate, $scope.currMetric, $scope.currDevice));
    $scope.mapData = getData($scope.currDomain.dataName, $scope.currDateRange.start, $scope.currDateRange.end, $scope.currMetric.dataName, $scope.currDevice.dataName);


    if ($scope.currMetric.dataName == 'avg_visit_duration') {

      $scope.currMaxVal = fancyTimeFormat(parseInt($scope.mapData['maxValue'])) + " Mins";
      $scope.currMinVal = fancyTimeFormat(parseInt($scope.mapData['minValue'])) + " Mins";


    } else if ($scope.currMetric.dataName == 'pages_per_visit') {

      $scope.currMaxVal = parseFloat($scope.mapData['maxValue']).toFixed(1) + " Pages";
      $scope.currMinVal = parseFloat($scope.mapData['minValue']).toFixed(1) + " Pages";



    } else if ($scope.currMetric.dataName == 'avg_sessions_per_user') {

      $scope.currMaxVal = parseFloat($scope.mapData['maxValue']).toFixed(1) + " Sessions";
      $scope.currMinVal = parseFloat($scope.mapData['minValue']).toFixed(1) + " Sessions";

    } else {


      $scope.currMaxVal = nFormatter(parseInt($scope.mapData['maxValue'])) + "";
      $scope.currMinVal = nFormatter(parseInt($scope.mapData['minValue'])) + "";


    }


    $scope.currMaxCountry = getCountryName[$scope.mapData['maxCountry']];
    $scope.currMinCountry = getCountryName[$scope.mapData['minCountry']];
    var expression = ["match", ["get", "ISO_N3"]];
    // Calculate color for each state based on the unemployment rate

    var color,currValue;

    var selectedCountryValue = $scope.mapData[$scope.toggleComparisonModeCountry];


  $scope.currCountryPercent =  100- (100 * ((selectedCountryValue - $scope.mapData["minValue"]) / $scope.mapData["maxValue"]));
  console.log($scope.currCountryPercent);
 

    for (var key in $scope.mapData) {
      if ($scope.mapData.hasOwnProperty(key)) {
if ($scope.toggleComparisonMode)
{


  if (selectedCountryValue == $scope.mapData["maxValue"]) {

    currValue = $scope.mapData[key] / selectedCountryValue;
    color = colorScaleCompareNeg(currValue).hex()

  } else if (selectedCountryValue == $scope.mapData["minValue"]) {
    
    currValue = selectedCountryValue / $scope.mapData[key];
    color = colorScaleComparePos(currValue).hex()

  } else {
    if (selectedCountryValue < $scope.mapData[key])
    {
       currValue = (($scope.mapData[key] - selectedCountryValue) / ($scope.mapData["maxValue"] - selectedCountryValue));
      color = colorScaleComparePos(currValue).hex()
  
    } else if (selectedCountryValue > $scope.mapData[key]) {
       currValue = (($scope.mapData[key] -  $scope.mapData["minValue"]) / (selectedCountryValue - $scope.mapData["minValue"]));
      color = colorScaleCompareNeg(currValue).hex()
  
    } else {
      color = "#1a1a1a";
  
    }
  }


}
else {
  currValue = (($scope.mapData[key] - $scope.mapData["minValue"]) / $scope.mapData["maxValue"]);
  color = colorScale(currValue).hex()
}
        
       
        expression.push(key, color);
      }
    }
    expression.push("rgba(0,0,0,0)");

    map.setPaintProperty('a', 'fill-color', expression);
    // map.setPaintProperty('a', 'fill-color', "#627BC1");
    map.setPaintProperty('a', 'fill-color', ["case",
      ["boolean", ["feature-state", "hover"], false],
      "#000",
      expression
    ]);

  };



}]);


var getCountryName = [];
for (var j = 0; j < allCountries.length; j++) {
  getCountryName[allCountries[j]["country-code"]] = allCountries[j]["name"];
}







function getPosInDateArr(month) {
  for (j = 0; j < allDates.length; j++) {
    if (allDates[j].dataName == month) {
      return j;
    }
  }
}

function getData(domain, datestart, dateend, metric, device) {

  var returnArr = {};
  var currMetric = device + "_" + metric;
  var AVGArr = [];

  for (var i = 0; i < allData.length; i++) {

    var isDateInRange = (getPosInDateArr(allData[i].yearmonth) >= getPosInDateArr(datestart) && getPosInDateArr(allData[i].yearmonth) <= getPosInDateArr(dateend));

    if (allData[i].site == domain && isDateInRange && allData[i][currMetric] && allData[i].country != '999') {
      if (returnArr[('000' + allData[i].country).substr(-3)]) {
        AVGArr[('000' + allData[i].country).substr(-3)]++;
        returnArr[('000' + allData[i].country).substr(-3)] += allData[i][currMetric];
      } else {
        AVGArr[('000' + allData[i].country).substr(-3)] = 1;;
        returnArr[('000' + allData[i].country).substr(-3)] = allData[i][currMetric];
      }
      // increase counter per country by 1

    }

  }

  // loop throu returnArr
  var maxValue = 0;
  var minValue = 0;
  var maxCountry = "";
  var minCountry = "";
  var minIsSet = false;

  for (var key in returnArr) {
    if (returnArr.hasOwnProperty(key)) {
      if (!minIsSet) {
        minValue = returnArr[key];
        minCountry = key;
        minIsSet = true;
      }
      // do average for times
      returnArr[key] = returnArr[key] / AVGArr[key];

      if (maxValue < returnArr[key]) {
        maxValue = returnArr[key];
        maxCountry = key;
      }
      if (minValue > returnArr[key]) {
        minValue = returnArr[key];
        minCountry = key;
      }
    }
  }

  returnArr['maxValue'] = maxValue
  returnArr['minValue'] = minValue
  returnArr['maxCountry'] = maxCountry
  returnArr['minCountry'] = minCountry

  // console.log(maxValue,minValue)
  return returnArr;
}

function fancyTimeFormat(time) {
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

function nFormatter(num, digits) {
  var si = [{
      value: 1,
      symbol: ""
    },
    {
      value: 1E3,
      symbol: "k"
    },
    {
      value: 1E6,
      symbol: "M"
    },
    {
      value: 1E9,
      symbol: "G"
    },
    {
      value: 1E12,
      symbol: "T"
    },
    {
      value: 1E15,
      symbol: "P"
    },
    {
      value: 1E18,
      symbol: "E"
    }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
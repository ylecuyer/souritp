var souritpControllers = angular.module('souritpControllers', []);

function getText(elt) {

	elt2 = elt.nextSibling;

	if (elt2.className.indexOf("schmsg") == 0) {
		return elt2.textContent;
	}
	else {
		return elt.textContent;
	}
}

function fixRATP(dom, direction) {

	elt = dom.getElementsByClassName('bg1')[direction];
	first = getText(elt);

	elt = dom.getElementsByClassName('bg3')[direction];
	next = getText(elt);

	return [first, next];
}

function getDOM(html) {

	var dom = document.implementation.createHTMLDocument("");
	dom.documentElement.innerHTML = html; 

  return dom;
}

function parseHTML(html, direction) {

	var dom = getDOM(html);

	return fixRATP(dom, direction);
}

function compareBuses(a, b) {

	asa = (a[1].indexOf("A l'arret") == 0);
	bsa = (b[1].indexOf("A l'arret") == 0);

	if (asa && bsa)
		return 0;
	if (asa)
		return -1;
	if (bsa)
		return 1;

	aa = parseInt(a[1]);
	bb = parseInt(b[1]);

	inaa = isNaN(aa);
	inbb = isNaN(bb);

	if (inaa && inbb)
		return 0;
	if (inaa)
		return 1;
	if (inbb)
		return -1;

	if (aa == bb)
		return 0;
	if (aa > bb)
		return 1;
	if (aa < bb)
		return -1;
}

function process(stations, $scope, $http, $q) {

	promises = [];

	stations.forEach(function(station) {
		promises.push($http.get(station[1] + "&dummy="+Date.now()));
	});


	$q.all(promises).then(function(data) {

		buses = [];

		for(i = 0; i < data.length; i++) {

			bus = parseHTML(data[i].data, stations[i][2]);

			buses.push([stations[i][0], bus[0]]);	
			buses.push([stations[i][0], bus[1]]);	

		}

		buses.sort(compareBuses);

		$scope.buses = buses;
		$scope.last_update = moment().format("HH:mm"); 
	});
}

souritpControllers.controller('WelcomeCtrl', ['$scope',
		function ($scope) {
      $scope.routes = JSON.parse(localStorage.getItem('routes'));
		}]);

souritpControllers.controller('ShowRouteCtrl', ['$scope', '$http', '$q', '$route', '$routeParams',
		function ($scope, $http, $q, $route, $routeParams) {

      routes = JSON.parse(localStorage.getItem('routes'))

      route = null;

      for(i = 0; i < routes.length; i++) {
        if (routes[i].id == $routeParams.RouteID) {
          route = routes[i]
          break;
        }
      }

      console.log(route);

			stations = [];

      for(i = 0; i < route.pickups.length; i++) {
        pickup = route.pickups[i]
        stations.push([pickup.line, 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B'+pickup.line+'&stationid='+pickup.station, pickup.terminus]);
		  }

			process(stations, $scope, $http, $q);

			$scope.title = route.name;
			$scope.last_update = "--:--";
			$scope.reload = $route.reload;
		}]);

souritpControllers.controller('AddRouteCtrl', ['$scope', '$http', '$location',
		function ($scope, $http, $location) {

      $scope.pickups = []
      $scope.terminuses = []

      $scope.save = function() {

        routes = JSON.parse(localStorage.getItem('routes'))

        if (routes == null) {
          routes = []
        }


        pickups = []

        for (i = 0; i < $scope.pickups.length; i++) {

          pickups.push({
            line: $scope.pickups[i].line,
            station: $scope.pickups[i].station.id,
            terminus: $scope.pickups[i].terminus.id
          });

        }
    
        routes.push({
          id: Date.now(),
          name: $scope.name,
          pickups: pickups
        });

        console.log(JSON.stringify(routes))

        localStorage.setItem('routes', JSON.stringify(routes));

        $location.path('/')

      }

      $scope.updateTerminuses = function(index) {

        $http.get('http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B'+$scope.pickups[index].line+'&stationid='+$scope.pickups[index].station.id).
            success(function(data, status, headers, config) {
              dom = getDOM(data)

              terminuses = dom.getElementsByClassName('subtitle');

              if (terminuses[2]) {
                $scope.pickups[index].terminuses.push({
                  id: 0,
                  name: terminuses[2].innerText
                });
              }
              if (terminuses[3]) {
                $scope.pickups[index].terminuses.push({
                  id: 1,
                  name: terminuses[3].innerText
                });
              }

            })

      }

      $scope.updateStations = function(index) {

        $http.get('http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B'+$scope.pickups[index].line+'&referer=station&stationname=*').
            success(function(data, status, headers, config) {

              $scope.pickups[index].stations = []

              dom = getDOM(data)
              
              bg1 = dom.getElementsByClassName('bg1');

              for (i = 0; i < bg1.length; i++) {

                a = bg1[i].getElementsByTagName('a')[0]

                href = a.getAttribute('href')

                $scope.pickups[index].stations.push({
                    id: href.substr(href.lastIndexOf('=') + 1),
                    name: a.innerText
                });

              }

            })

      }

      $scope.removePickup = function(index) {
      
        $scope.pickups.splice(index, 1);

      }

      $scope.addPickup = function() {

        $scope.pickups.push({
          line: '',
          stations: [],
          station: '',
          terminuses: [],
          terminus: ''
        });

      }

		}]);


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

function parseHTML(html, direction) {

	var dom = document.implementation.createHTMLDocument("");
	dom.documentElement.innerHTML = html; 

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
		}]);

souritpControllers.controller('HomeWorkCtrl', ['$scope', '$http', '$q', '$route',
		function ($scope, $http, $q, $route) {

			stations = [];

			stations.push(["179", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B179&stationid=179_5439_5448', 1]);
			stations.push(["390", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B390&stationid=390_4910_4978', 1]);
			stations.push(["395", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B395&stationid=395_4953_4954', 0]);
			
			process(stations, $scope, $http, $q);

			$scope.title = "Maison > Travail";
			$scope.last_update = "--:--";
			$scope.reload = $route.reload;
		}]);

souritpControllers.controller('WorkHomeCtrl', ['$scope', '$http', '$q', '$route',
		function ($scope, $http, $q, $route) {

			stations = [];

			stations.push(["595", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B595&stationid=595_5131', 0]);
			stations.push(["395", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B395&stationid=395_4934_4935', 1]);
			stations.push(["179", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B179&stationid=179_5439_5448', 0]);
			
			process(stations, $scope, $http, $q);

			$scope.title = "Travail > Maison";
			$scope.last_update = "--:--";
			$scope.reload = $route.reload;
		}]);

souritpControllers.controller('HomeTownCtrl', ['$scope', '$http', '$q', '$route',
		function ($scope, $http, $q, $route) {

			stations = [];

			stations.push(["390", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B390&stationid=390_4910_4978', 1]);
			stations.push(["395", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B395&stationid=395_4953_4954', 0]);
			
			process(stations, $scope, $http, $q);

			$scope.title = "Maison > Coeur de ville";
			$scope.last_update = "--:--";
			$scope.reload = $route.reload;
		}]);

souritpControllers.controller('TownHomeCtrl', ['$scope', '$http', '$q', '$route',
		function ($scope, $http, $q, $route) {

			stations = [];

			stations.push(["390", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B390&stationid=390_4912_4980', 0]);
			stations.push(["395", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B395&stationid=395_4949_4950', 1]);
			
			process(stations, $scope, $http, $q);

			$scope.title = "Coeur de ville > Maison";
			$scope.last_update = "--:--";
			$scope.reload = $route.reload;
		}]);

souritpControllers.controller('HomeRERCtrl', ['$scope', '$http', '$q', '$route',
		function ($scope, $http, $q, $route) {

			stations = [];

			stations.push(["390", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B390&stationid=390_4910_4978', 0]);
			stations.push(["395", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B395&stationid=395_4953_4954', 1]);
			stations.push(["179", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B179&stationid=179_5439_5448', 0]);
			
			process(stations, $scope, $http, $q);

			$scope.title = "Maison > RER";
			$scope.last_update = "--:--";
			$scope.reload = $route.reload;
		}]);

souritpControllers.controller('RERHomeCtrl', ['$scope', '$http', '$q', '$route',
		function ($scope, $http, $q, $route) {

			stations = [];

			stations.push(["179", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B179&stationid=179_5446', 0]);
			stations.push(["390", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B390&stationid=390_4907_4975', 1]);
			stations.push(["395", 'http://wap.ratp.fr/siv/schedule?service=next&reseau=bus&lineid=B395&stationid=395_4080_4892', 0]);
			
			process(stations, $scope, $http, $q);

			$scope.title = "RER > Maison";
			$scope.last_update = "--:--";
			$scope.reload = $route.reload;
		}]);

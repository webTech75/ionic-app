	var app = angular.module('astro-app');
	app.controller('AppCtrl', appController);
	app.controller('OverviewCtrl', overviewController);
	app.controller('PlaylistCtrl', playlistController);

	function appController($scope, $ionicModal, $timeout, $ionicLoading, $state) {

	    // Form data for the login modal
	    $scope.loginData = {};

	    // Create the login modal that we will use later
	    $ionicModal.fromTemplateUrl('templates/login.html', {
	        scope: $scope
	    }).then(function(modal) {
	        $scope.modal = modal;
	    });

	    // Triggered in the login modal to close it
	    $scope.closeLogin = function() {
	        $scope.modal.hide();
	    };

	    // Open the login modal
	    $scope.login = function() {
	        $scope.modal.show();
	    };

	    // Perform the login action when the user submits the login form
	    $scope.doLogin = function() {
	        console.log('Doing login', $scope.loginData);

	        // Simulate a login delay. Remove this and replace with your login
	        // code if using a login system
	        $timeout(function() {
	            $scope.closeLogin();
	        }, 1000);
	    }

	    $scope.showLoader = function() {
	        $ionicLoading.show({
	            content: 'Loadin',
	            animation: 'fade-in',
	            showBackdrop: false,
	            maxWidth: 200,
	            showDelay: 0
	        });
	        $timeout(function() {
	            $ionicLoading.hide();
	        }, 1000);
	    };

	    $scope.details = function() {
	        $state.go("app.charts");
	        $scope.showLoader();
	    }
	};

	function overviewController(GaugeService, GraphService) {
		
		 $(".date").click(function(e) {
           e.stopPropagation();
           if ($(".popupDiv").hasClass('show')) {
               $(".container").toggleClass("blur-on");
               $('.popupDiv').toggleClass('topPlace');
               $('.popup-overlay').toggleClass('show');
               $(".popupDiv").toggleClass("show");
           } else {
               $(".popupDiv").toggleClass("show");
                $('.popup-overlay').toggleClass('show');
               $('.popupDiv').toggleClass('topPlace');
               $(".container").toggleClass("blur-on");
           }
 
       });
 
       $('.popup-overlay').on('click', function() {
           $(".popupDiv").removeClass("show");
           $('.popupDiv').addClass('topPlace');
           $(".container").removeClass("blur-on");
            $('.popup-overlay').toggleClass('show');
       });
 
	    var self = this;

	    self.flipped = {
	        1: false,
	        2: false,
	        3: false,
	        4: false,
	        5: false,
	        6: false,
	        7: false,
	    };

	    // GAUGES
	    function drawGauges() {
	        GaugeService.draw('gauge-3', {
	            min: 0,
	            max: 150,
	            label: {
	                min: 0,
	                max: '150k'
	            },
	            value: 120,
	            direction: 'down',
	            color: '#5ca946'
	        }, {
	            gauge: {
	                type: 'single',
	            }
	        });

	        GaugeService.draw('gauge-4', {
	            min: 0,
	            max: 100,
	            label: {
	                min: 0,
	                max: '100k'
	            },
	            value: 57,
	            direction: 'down',
	            color: '#5ca946'
	        }, {
	            gauge: {
	                type: 'single',
	            }
	        });

	        GaugeService.draw('gauge-5', {
	            min: 0,
	            max: 250,
	            label: {
	                min: 0,
	                max: '250k'
	            },
	            value: 210,
	            direction: 'up',
	            color: '#5ca946'
	        }, {
	            gauge: {
	                type: 'single',
	            }
	        });

	        GaugeService.draw('gauge-6', {
	            min: 0,
	            max: 50,
	            label: {
	                min: 0,
	                max: '50k'
	            },
	            value: 35,
	            direction: 'down',
	            color: '#5ca946'
	        });
	    };
	    drawGauges();

	    // MAIN GRAPH
	    self.chartObj;

	    function drawGraph() {
	        var graphSeries = [{
	            name: 'Tokyo',
	            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
	        }, {
	            name: 'London',
	            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
	        }];

	        self.chartObj = GraphService.graphConfig(graphSeries);
	    };
	    drawGraph();

	    // GAUGES FIGURE BACK GRAPH
	    function drawGraphGauges() {
	        GraphService.drawHistory('history1');
	        GraphService.drawHistory('history2');
	        GraphService.drawHistory('history3');
	        GraphService.drawHistory('history4');
	    };
	    drawGraphGauges();


	};

	

	function playlistController($scope, $stateParams) {};

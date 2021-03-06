	var app = angular.module('astro-app');
	app.controller('AppCtrl', appController);
	app.controller('OverviewCtrl', overviewController);

	function appController($scope) {
		var self = this;

		// MENU
		self.selectedTab = 'overview';

		self.goTo = function(tabName) {
			self.selectedTab = tabName
		};
	};

	function appControllerOld($scope, $ionicModal, $timeout, $ionicLoading, $state) {

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

	    $scope.which = $state.params.chart;

	    $scope.details = function() {
	        $state.go("app.charts");
	        $scope.showLoader();
	    }
	};

	function overviewController($scope, $ionicSideMenuDelegate, backendData, GaugeService, GraphService) {
		var self = this;

		self.data = $.extend(true, {}, backendData);

		self.currentDate = moment().format('MMMM DD, YYYY');

		// MENU CONTROL
		self.toggleSideMenu = function() {
			$ionicSideMenuDelegate.toggleLeft();
		};

		// ELEMENTS STATUS
		self.flipped = {
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false,
			7: false,
		};

		// INITIALIZATION
		$scope.$on('$ionicView.afterEnter', function() {
			self.graphSwiper = new Swiper('.graph .swiper-container', {
		        pagination: '.graph .swiper-container .swiper-pagination',
		        paginationClickable: true,
		        spaceBetween: 80
		    });

			drawGraphs();
			drawGauges();
			drawGaugesHistory();
		});

		// GRAPHS
		self.graphs = [];

		self.graphSwiper;

		function drawGraphs() {
			for (var i=0; i < self.data.graphs.length; i++) {
				self.graphs[i] = GraphService.drawGraph('graph' + i, self.data.graphs[i]);
			}
		};

		// MESSAGE CENTER
		self.alertMessage = {};
		self.showMessageDetails = false;

		self.goToMessage = function(messageId) {
			self.alertMessage = {};
			for (var i=0; i < self.data.alertMessages.length; i++) {
				if (self.data.alertMessages[i].id == messageId) {
					self.alertMessage = self.data.alertMessages[i];
					break;
				}
			}
			self.showMessageDetails = !self.showMessageDetails;
		};

		// GAUGES
		self.gauges = [];

		self.formatGaugeDate = function(str) {
			return moment(str.slice(0,19), 'YYYY-MM-DDTHH:mm:ss').format('DD-MMM');
		};
		self.formatGaugeDate2 = function(str) {
			return moment(str.slice(0,19), 'YYYY-MM-DDTHH:mm:ss').format('DD MMM YYYY');
		};

		self.formatGaugeValue = function(value) {
			if (value >= 1000000) {
				return (value / 1000000).toFixed(2) + 'M';
			}
			if (value >= 1000) {
				return (value / 1000).toFixed(2) + 'K';
			}
			return value;
		};

		function drawGauges() {
			for (var i=0; i < self.data.gauges.length; i++) {
				self.gauges[i] = GaugeService.draw('gauge' + i, self.data.gauges[i]);
			}
		};

		// GAUGE HISTORY
		self.history = [];

		function drawGaugesHistory() {
			for (var i=0; i < self.data.gauges.length; i++) {
				self.history[i] = GraphService.drawHistory('history' + i, self.data.gauges[i].history);
			}
		};
	};

	function overviewControllerOld($scope, $ionicModal, $timeout, $ionicLoading, $state, GraphService, GaugeService) {
		var self = this;

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

	    $scope.galleryTop = new Swiper('.gallery-top', {
	        nextButton: '.swiper-button-next',
	        prevButton: '.swiper-button-prev',
	        spaceBetween: 10,
	        parallax: true,
	        speed: 600,
	    });
	    $scope.galleryThumbs = new Swiper('.gallery-thumbs', {
	        spaceBetween: 10,
	        centeredSlides: true,
	        slidesPerView: 'auto',
	        touchRatio: 0.2,
	        slideToClickedSlide: true,
	        speed: 600,
	    });
	    $scope.galleryTop.params.control = $scope.galleryThumbs;
	    $scope.galleryThumbs.params.control = $scope.galleryTop;

	    //chart data for desktop/ipad
	    if (!navigator.userAgent.match(/iphone/i)) {
	        $scope.graphSeries = [{
	            name: 'Tokyo',
	            marker: {
	                symbol: 'square'
	            },
	            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
	                y: 26.5,
	                marker: {
	                    symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'
	                }
	            }, 23.3, 18.3, 13.9, 9.6]
	
	        }, {
	            name: 'London',
	            marker: {
	                symbol: 'diamond'
	            },
	            data: [{
	                y: 3.9,
	                marker: {
	                    symbol: 'url(http://www.highcharts.com/demo/gfx/snow.png)'
	                }
	            }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
	        }];
	    } else {
	        //column chart data for iphones
	        $scope.graphSeries = [{
	            name: 'Tokyo',
	            marker: {
	                symbol: 'square'
	            },
	            data: [7.0, 6.9, 9.5,{
	                y: 14.5,
	                marker: {
	                    symbol: 'url(http://www.highcharts.com/demo/gfx/sun.png)'
	                }
	            }, 18.2, 21.5]
	
	        }, {
	            name: 'London',
	            marker: {
	                symbol: 'diamond'
	            },
	            data: [{
	                y: 3.9,
	                marker: {
	                    symbol: 'url(http://www.highcharts.com/demo/gfx/snow.png)'
	                }
	            }, 4.2, 5.7, 8.5, 11.9]
	        }];
	    }
	    $scope.chartConfig = GraphService.graphConfig($scope.graphSeries);

	    // draw gauges
	    GaugeService.draw('gauge-1', {
			min: 0,
			max: 100,
			label: {
				min: 0,
				max: 100
			},
			value: 20,
			direction: 'up',
			color: '#5ca946'
		});

	    GaugeService.draw('gauge-2', {
			min: 0,
			max: 100,
			label: {
				min: 0,
				max: 100
			},
			value: 40,
			direction: 'down',
			color: '#027bb4'
		}, {
			gauge: {
				type: 'single'
			}
		});

	    GaugeService.draw('gauge-3', {
			min: 0,
			max: 100,
			label: {
				min: 0,
				max: 100
			},
			value: 60,
			direction: 'down',
			color: '#fcb134'
		});

	    GaugeService.draw('gauge-4', {
			min: 0,
			max: 100,
			label: {
				min: 0,
				max: 100
			},
			value: 80,
			direction: 'up',
			color: '#dd0303'
		});

	};

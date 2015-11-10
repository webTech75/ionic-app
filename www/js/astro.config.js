
angular.module('astro-app')

	.constant('$ionicLoadingConfig', {
		template: '<ion-spinner class="spinner-energized"></ion-spinner>'
	})

	.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

		$ionicConfigProvider.views.maxCache(0); // do not cache views

		$ionicConfigProvider.scrolling.jsScrolling(false); // enables native scrolling

	    $urlRouterProvider.otherwise('/app/overview');

		$stateProvider
			.state('app', {
				url: '/app',
				abstract: true,
				templateUrl: 'templates/astro.html',
				controller: 'AppCtrl as vm'
			})
			.state('app.overview', {
				url: '/overview',
				resolve: {
					backendData: function(BackendService) {
						return BackendService.getOverviewData();
					}
				},
				views: {
					'appContent': {
						templateUrl: 'templates/overview.html',
						controller: 'OverviewCtrl as vm'
					}
				}
			})
			.state('app.charts', {
				url: '/overview/charts',
				views: {
					'appContent': {
						templateUrl: 'templates/charts.html'
					}
				}
			})
			.state('app.system', {
				url: '/system',
				views: {
					'appContent': {
						templateUrl: 'templates/system.html'
					}
				}
			})
			.state('app.kpis', {
				url: '/kpis',
				views: {
					'appContent': {
						templateUrl: 'templates/kpis.html'
					}
				}
			})
			.state('app.program', {
				url: '/program',
				views: {
					'appContent': {
						templateUrl: 'templates/program.html'
					}
				}
			})
			.state('app.settings', {
				url: '/settings',
				views: {
					'appContent': {
						templateUrl: 'templates/settings.html'
					}
				}
			})
			.state('app.profile', {
				url: '/profile',
				views: {
					'menuContent': {
						templateUrl: 'templates/profile.html'
					}
				}
			});
});

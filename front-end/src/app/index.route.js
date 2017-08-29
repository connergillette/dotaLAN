export function routerConfig($stateProvider, $urlRouterProvider) {
	'ngInject';
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'app/main/main.html',
			controller: 'MainController',
			controllerAs: 'main'
		})

		.state('login', {
			url: '/login',
			templateUrl: 'app/auth/login.html',
			controller: 'AuthController',
			controllerAs: 'auth'
		})

		.state('register', {
			url: '/register',
			templateUrl: 'app/auth/register.html',
			controller: 'AuthController',
			controllerAs: 'auth'
		})

		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'app/dashboard/dashboard.html',
			controller: 'DashboardController',
			controllerAs: 'dashboard'
		})

		.state('newEvent', {
			url: '/event/add',
			templateUrl: 'app/events/addevent.html',
			controller: 'EventsController',
			controllerAs: 'events'
		})

		.state('event', {
			url: '/event/:id',
			templateUrl: 'app/events/event.html',
			controller: 'EventsController',
			controllerAs: 'events'
		})

		.state('player', {
			url: '/player/:id',
			templateUrl: 'app/dashboard/dashboard.html',
			controller: 'DashboardController',
			controllerAs: 'dashboard'
		});

	$urlRouterProvider.otherwise('/dashboard');
}

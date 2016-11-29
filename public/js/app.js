'use strict'

// Create modules
var MainModule = angular.module('MainModule', ['chart.js', 'underscore', 'frapontillo.bootstrap-switch', 'angularFileUpload',
    'jlareau.pnotify']);

angular.module('UserModule', ['MainModule', 'angularFileUpload']);
angular.module('SystemModule', ['MainModule', 'frapontillo.bootstrap-switch']);
angular.module('EndpointModule', ['MainModule']);
angular.module('DashboardModule', ['MainModule']);
angular.module('WidgetModule', ['MainModule']);

var app = angular.module('app', ['ngRoute', 'ngCookies',
     'jlareau.pnotify', 'UserModule', 'SystemModule', 'EndpointModule', 'WidgetModule']);

app.config(config);
app.run(run);

config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "views/home.html"
        })
        .when("#", {
            templateUrl : "views/home.html"
        })

        .when("/login", {
            templateUrl : "views/login.html",
            controller : "LoginController"
        })
        .when("/register", {
            templateUrl : "views/register.html",
            controller : "RegisterController"
        })


        // View User Profile
        .when('/user', {	
            templateUrl : 'views/profile.html'
        })


        // View All Systems Page
        .when('/systems', {	
            templateUrl : 'views/view_systems.html',
            controller : 'SystemController'
        })
        // Create System Page
        .when('/systems/create', {	
            templateUrl : 'views/create_system.html',
            controller : 'SystemController'
        })


        // View All Endpoints Page
        .when('/endpoints', {	
            templateUrl : 'views/view_endpoints.html',
            controller : 'EndpointController'
        })
        // Create Endpoint Page
        .when('/endpoints/create', {	
            templateUrl : 'views/create_endpoint.html',
            controller : 'EndpointController'
        })


        // Create Widget Page
        .when('/widgets/create', {	
            templateUrl : 'views/create_widget.html',
            controller : 'WidgetController'
        })


        .otherwise({
            redirectTo : '/error_pages/page_404.html'
        });
};

run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
function run($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};

    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['authorization'] = "token " + $rootScope.globals.currentUser.token;
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;

        // If user not logged in
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }

        if($location.path() === '/login' || $location.path() === '/register') {
            $rootScope.fullPage = true;
        } else {
            $rootScope.fullPage = false;
        }

    });
};

// Optional configuration
MainModule.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: ["#455C73",
            "#9B59B6",
            "#BDC3C7",
            "#26B99A",
            "#3498DB"],
        responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
        showLines: true
    });

}]);

MainModule.config(['notificationServiceProvider', function(notificationServiceProvider) {

    notificationServiceProvider.setDefaults({
        history: false,
        closer: false,
        delay: 4000,
        closer_hover: false,
        styling : 'bootstrap3'
    })

}]);
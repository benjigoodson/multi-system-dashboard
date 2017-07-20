'use strict'

// Create modules and import key dependencies
var MainModule = angular.module('MainModule', ['chart.js', 'underscore', 'frapontillo.bootstrap-switch', 'angularFileUpload',
    'jlareau.pnotify', 'ui.select', 'ngSanitize', 'ui.bootstrap']);

angular.module('UserModule', ['MainModule', 'angularFileUpload']);
angular.module('SystemModule', ['MainModule', 'frapontillo.bootstrap-switch']);
angular.module('EndpointModule', ['MainModule']);
angular.module('DashboardModule', ['MainModule', 'ui.select']);
angular.module('WidgetModule', ['MainModule']);

var app = angular.module('app', ['ngRoute', 'ngCookies',
     'jlareau.pnotify', 'UserModule', 'SystemModule', 'EndpointModule', 'WidgetModule', 'DashboardModule']);

// Configure the application using the config function below
app.config(config);

// Run the application using the fun function
app.run(run);

// Inject dependencies
config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider) {

    // Set up the routes for the application
    $routeProvider

        // Home page
        .when("/", {
            templateUrl : "views/home.html"
        })
        .when("#", {
            templateUrl : "views/home.html"
        })

        // Login page
        .when("/login", {
            templateUrl : "views/login.html",
            controller : "LoginController"
        })
        // Register Page
        .when("/register", {
            templateUrl : "views/register.html",
            controller : "RegisterController"
        })
        // Forgot Page
        .when("/forgot", {
            templateUrl : "views/forgot.html",
            controller : "ForgotController"
        })
        // Reset Page
        .when("/forgot/:token", {
            templateUrl : "views/reset.html",
            controller : "ForgotController"
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
        .when('/system/create', {	
            templateUrl : 'views/create_system.html',
            controller : 'SystemController'
        })
        // View System Page
        .when('/system/:system_id', {	
            templateUrl : 'views/system.html',
            controller : 'SystemController'
        })


        // View All Endpoints Page
        .when('/endpoints', {	
            templateUrl : 'views/view_endpoints.html',
            controller : 'EndpointController'
        })
        // Create Endpoint Page
        .when('/endpoint/create', {	
            templateUrl : 'views/create_endpoint.html',
            controller : 'EndpointController'
        })
        // View Endpoint Page
        .when('/endpoint/:endpoint_id', {	
            templateUrl : 'views/endpoint.html',
            controller : 'EndpointController'
        })


        // Create Widget Page
        .when('/widget/create', {	
            templateUrl : 'views/create_widget.html',
            controller : 'WidgetController'
        })
        // View All Widgets Page
        .when('/widgets', {	
            templateUrl : 'views/view_widgets.html',
            controller : 'WidgetController'
        })
        // Widget Page
        .when('/widget/:widget_id', {	
            templateUrl : 'views/widget.html',
            controller : 'WidgetController'
        })
        

        // Create Dashboard Page
        .when('/dashboard/create', {	
            templateUrl : 'views/create_dashboard.html',
            controller : 'DashboardController'
        })
        // Dashboard Page
        .when('/dashboard/:dashboard_id', {	
            templateUrl : 'views/dashboard.html',
            controller : 'DashboardController'
        })
        // Edit dashboard Page
        .when('/dashboard/:dashboard_id/edit', {	
            templateUrl : 'views/edit_dashboard.html',
            controller : 'DashboardController'
        })

        .otherwise({
            redirectTo : '/error_pages/page_404.html'
        });
};

// Inject dependencies
run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

function run($rootScope, $location, $cookieStore, $http) {
    // Keep user logged in after page refresh
    // Get the cookies
    $rootScope.globals = $cookieStore.get('globals') || {};

    // If a user is logged in
    if ($rootScope.globals.currentUser) {
        // set the API auth to their API token
        $http.defaults.headers.common['authorization'] = $rootScope.globals.currentUser.token;
    }

    // When changing location
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // Redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = true;

        ['/login', '/register', '/forgot', '/error_pages'].forEach(function(unsecurePage) {
            if($location.path().includes(unsecurePage)) {
                restrictedPage = false;
            }
        }, this);
        
        var loggedIn = $rootScope.globals.currentUser;

        // If user not logged in
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }

        // Global varible used to help format the page
         $rootScope.fullPage = false;

        ['/login', '/register', '/forgot', '/error_pages'].forEach(function(fullPage) {
            if($location.path().includes(fullPage)) {
                $rootScope.fullPage = true;
            }
        }, this);

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
        responsive: true,
        maintainAspectRatio: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
        showLines: true
    });

}]);

// Configuration for the notification provider
MainModule.config(['notificationServiceProvider', function(notificationServiceProvider) {
    // Set the config values
    notificationServiceProvider.setDefaults({
        history: false,
        closer: false,
        delay: 4000,
        closer_hover: false,
        styling : 'bootstrap3'
    })

}]);
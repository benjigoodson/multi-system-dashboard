var AppModule = angular.module('app');

AppModule.factory('AuthorizationService', AuthorizationService);
	
AuthorizationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
function AuthorizationService($http, $cookieStore, $rootScope, $timeout, UserService) {

    var service = {};

    service.Login = Login;
    service.SetCredentials = SetCredentials;
    service.ClearCredentials = ClearCredentials;

    return service;

    function Login(username, password, callback) {

        $http.post('/api/authenticate', { username: username, password: password })
            .success(function (response) {
                callback(response);
            });

    }

    function SetCredentials(username, password, token) {

        $rootScope.globals = {
            currentUser: {
                username: username,
                token: token
            }
        };

        $http.defaults.headers.common['authorization'] = "token " + token;
        $cookieStore.put('globals', $rootScope.globals);
    }

    function ClearCredentials() {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'token';
    }
}
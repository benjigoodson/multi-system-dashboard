var AppModule = angular.module('app');

AppModule.factory('AuthorisationService', AuthorisationService);
	
AuthorisationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
function AuthorisationService($http, $cookieStore, $rootScope, $timeout, UserService) {

    return {

        login : function(username, password, callback) {

            $http.post('/api/authenticate', { username: username, password: password })
                .success(function (response) {
                    callback(response);
                }
            );
        },

        setCredentials : function(username, token) {

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    token: token
                }
            };

            $http.defaults.headers.common['authorization'] = "token " + token;
            $cookieStore.put('globals', $rootScope.globals);
        },

        clearCredentials : function() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.authorisation = 'token';
        }
    };
}
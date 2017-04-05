var AppModule = angular.module('app');

AppModule.factory('AuthorisationService', AuthorisationService);
	
AuthorisationService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout', 'UserService'];
function AuthorisationService($http, $cookieStore, $rootScope, $timeout, UserService) {

    return {

        login : function(username, password, callback) {

            // Make request to authenticate the user
            $http.post('/api/authenticate', { username: username, password: password })
                .success(function (response) {
                    callback(response);
                }
            );
        },

        setCredentials : function(username, token) {

            // Set the global value in the root scope
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    token: token
                }
            };

            // Create a header which is used for every request containing the api token
            $http.defaults.headers.common['authorization'] = "token " + token;

            // Create a cookie with the users details
            $cookieStore.put('globals', $rootScope.globals);
        },

        clearCredentials : function() {
            // Remove all of the saved credentails
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.authorisation = 'token';
        }
    };
}
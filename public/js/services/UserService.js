var UserModule = angular.module('UserModule');

UserModule.factory('UserService', UserService);

UserService.$inject = ['$http', '$cookieStore'];
function UserService($http, $cookieStore) {

	var currentUser;

	function getCurrentUser() {

		if(!currentUser) {

			if($cookieStore.get('globals')) {

				var username = $cookieStore.get('globals').currentUser.username;

				var promise = getByUsername(username).then(function(user){
					
					currentUser = user;
					return currentUser;

				});

				return promise;
			}
		} else {
			return currentUser;
		}

	};

	function setCurrentUser(user) {

		currentUser = user;
		
	};

	function getByUsername(username) {
		var promise = $http.get('/api/user/' + username) .then(function(response) {
			return response.data[0];
		}, function(error) {
 			handleError(error);
		})

		return promise;
	};

	function create(user) {
		var promise = $http.post('/api/user', user) .then(function(response) {
			return response;
		}, function(error) {
 			handleError(error);
		})

		return promise;
	};

	function uploadImage(id, image) {
		var promise = $http.put('/api/user/' + id, image) .then(function(response) {
			return response;
		}, function(error) {
 			handleError(error);
		})

		return promise;
	};

	function update(id, user) {
		var promise = $http.put('/api/user/' + id, user) .then(function(response) {
			return response;
		}, function(error) {
 			handleError(error);
		})

		return promise;
	};

	// private functions

	function handleError(error) {
		return function() {
			return { success: false, message: error };
		};
	};

	return {
		getByUsername : getByUsername,
		create : create,
		uploadImage : uploadImage,
		update : update,
		setCurrentUser : setCurrentUser,
		getCurrentUser : getCurrentUser
	};
}
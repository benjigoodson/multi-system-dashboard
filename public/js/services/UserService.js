var UserModule = angular.module('UserModule');

UserModule.factory('UserService', UserService);

UserService.$inject = ['$http', '$q', '$cookieStore'];
function UserService($http, $q, $cookieStore) {

	var currentUser;

	function getCurrentUser() {

		return $q(function(resolve, reject) {

			if(!currentUser) {

				if($cookieStore.get('globals')) {

					var username = $cookieStore.get('globals').currentUser.username;

					getByUsername(username).then(function(user){
						
						currentUser = user;
						resolve(currentUser);

					});
				}
			} else {
				resolve(currentUser);
			}

		});

	};

	function setCurrentUser(user) {
		currentUser = user;		
	};
	
	function getStats(userId) {

		return $http.get('/api/user/stats/' + userId).then(function(response) {
			return response.data;
		}, function(error) {
 			handleError(error);
		});	

	};

	function getByUsername(username) {
		return $http.get('/api/user/' + username).then(function(response) {
			return response.data[0];
		}, function(error) {
 			handleError(error);
		});
	};

	function create(user) {
		return $http.post('/api/user', user).then(function(response) {
			return response;
		}, function(error) {
 			handleError(error);
		});
	};

	function uploadImage(id, image) {
		var promise = $http.put('/api/user/' + id, image).then(function(response) {
			return response;
		}, function(error) {
 			handleError(error);
		})

		return promise;
	};

	function update(id, user) {
		var promise = $http.put('/api/user/' + id, user) .then(function(response) {
			return response.data;
		}, function(error) {
 			self.handleError(error);
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
		getStats : getStats,
		create : create,
		uploadImage : uploadImage,
		update : update,
		setCurrentUser : setCurrentUser,
		getCurrentUser : getCurrentUser
	};
}
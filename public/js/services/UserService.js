var UserModule = angular.module('UserModule');

UserModule.factory('UserService', UserService);

UserService.$inject = ['$http', '$q', '$cookieStore'];
function UserService($http, $q, $cookieStore) {

	var self = {

		currentUser : "",

		// Make request to get the details for the user currently logged in
		getCurrentUser : function() {
			return $q(function(resolve, reject) {

				if(!self.currentUser) {
					if($cookieStore.get('globals')) {
						var username = $cookieStore.get('globals').currentUser.username;

						self.getByUsername(username).then(function(user) {
							self.currentUser = user;
							resolve(self.currentUser);
						});
					}
				} else {
					resolve(self.currentUser);
				}
			});
		},

		// Set the value of the currently logged in user
		setCurrentUser : function(user) {
			self.currentUser = user;		
		},
		
		// Make request to get the stats for the user id passed
		getStats : function(userId) {
			return $http.get('/api/user/stats/' + userId).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});	

		},

		// Make request to get as user by the username
		getByUsername : function(username) {
			return $http.get('/api/user/' + username).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});
		},

		// Make request to create a user
		create : function(user) {
			return $http.post('/api/user/create', user).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});
		},

		// Make request to upload an image
		uploadImage : function(id, image) {
			return $http.put('/api/user/' + id, image).then(function(response) {
				return response;
			}, function(error) {
				return error.data;
			});
		},

		// Make request to update a user
		update : function(id, user) {
			return $http.put('/api/user/' + id, user).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});
		},

		// Forgot password
		forgotPassword : function(email) {
			return $http.post('/api/user/forgot', {email : email}).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});
		},

		// Reset password
		resetPassword : function(token, newPassword) {
			return $http.post('/api/user/forgot/' + token, { token : token, password : newPassword }).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});
		},

		// Validate token
		validateToken : function(token) {
			return $http.get('/api/user/forgot/validate/' + token).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});
		}

	};

	return self;
}
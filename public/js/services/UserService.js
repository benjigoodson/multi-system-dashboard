var UserModule = angular.module('UserModule');

UserModule.factory('UserService', UserService);

UserService.$inject = ['$http', '$q', '$cookieStore'];
function UserService($http, $q, $cookieStore) {

	var self = {

		currentUser : "",

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

		setCurrentUser : function(user) {
			self.currentUser = user;		
		},
		
		getStats : function(userId) {

			return $http.get('/api/user/stats/' + userId).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});	

		},

		getByUsername : function(username) {
			return $http.get('/api/user/' + username).then(function(response) {
				return response.data[0];
			}, function(error) {
				return error.data;
			});
		},

		create : function(user) {
			return $http.post('/api/user/create', user).then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});
		},

		uploadImage : function(id, image) {
			return $http.put('/api/user/' + id, image).then(function(response) {
				return response;
			}, function(error) {
				return error.data;
			});
		},

		update : function(id, user) {
			return $http.put('/api/user/' + id, user) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			});
		}

	};

	return self;
}
var UserModule = angular.module('UserModule');

UserModule.controller('LoginController', LoginController);

// Inject dependencies
LoginController.$inject = ['$location', '$window', 'AuthorisationService', 'UserService'];

function LoginController($location, $window, AuthorisationService, UserService) { 

	(function initController() {
		// Reset login status
		AuthorisationService.clearCredentials();
	})();

	this.login = function() {

		var self = this;
		self.errorMessage = "";

		// Try to log into the system
		AuthorisationService.login(self.username, self.password, function (response) {
			if (response.success) {
				// Set the user's credentials
				AuthorisationService.setCredentials(self.username, response.token);

				// Set the current user
				UserService.setCurrentUser(response.user);

				// Go to the home screen
				$location.path('/');

				$window.location.reload();

			} else {

				// Reset entered password
				self.password = "";

				// Set an error message
				self.errorMessage = response.message;

			}
		});
	};

};
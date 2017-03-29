var UserModule = angular.module('UserModule');

UserModule.controller('LoginController', LoginController);

LoginController.$inject = ['$location', '$window', 'AuthorisationService', 'UserService'];
function LoginController($location, $window, AuthorisationService, UserService) { 

	(function initController() {
		// reset login status
		AuthorisationService.clearCredentials();
	})();

	this.login = function() {

		var self = this;
		self.errorMessage = "";

		AuthorisationService.login(self.username, self.password, function (response) {
			if (response.success) {

				AuthorisationService.setCredentials(self.username, response.token);
				UserService.setCurrentUser(response.user);
				$location.path('/');
				$window.location.reload();

			} else {

				self.errorMessage = response.message;

			}
		});
	};

};
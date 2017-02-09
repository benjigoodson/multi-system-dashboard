var UserModule = angular.module('UserModule');

UserModule.controller('LoginController', LoginController);

LoginController.$inject = ['$location', '$window', 'AuthorizationService', 'UserService'];
function LoginController($location, $window, AuthorizationService, UserService) { 

	(function initController() {
		// reset login status
		AuthorizationService.ClearCredentials();
	})();

	this.login = function() {

		var self = this;
		self.errorMessage = "";

		AuthorizationService.Login(self.username, self.password, function (response) {
			if (response.success) {

				AuthorizationService.SetCredentials(self.username, response.token);
				UserService.setCurrentUser(response.user);
				$location.path('/');
				$window.location.reload();

			} else {

				self.errorMessage = response.message;

			}
		});
	};

};
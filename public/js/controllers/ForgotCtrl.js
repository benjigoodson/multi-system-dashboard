var UserModule = angular.module('UserModule');

UserModule.controller('ForgotController', ForgotController);

ForgotController.$inject = ['$location', '$routeParams', '$scope', 'UserService', 'notificationService'];
function ForgotController($location, $routeParams, $scope, UserService, notificationService) { 

    // Called when loading reset password page
    this.init = function() {

		// Get the token
        this.token = $routeParams.token;

        // Validate the token
        this.validateToken(this.token);

	};

    this.submit = function () {

        // Reset passsword
        UserService.forgotPassword(this.email)
        .then(function (response) {

            $scope.success = response.success;

            // Display message to the user
            $scope.message = response.message;

        }, function errorHandler (error) {
            // Display an error
            $scope.message = error.message;
        });
    }

    this.reset = function () {

        if($scope.resetForm.password !== $scope.resetForm.confirmedPassword) {
            $scope.message = "Please ensure both passwords match."
            return;
        }  

        // Reset passsword
        UserService.resetPassword(this.token, $scope.resetForm.password).then(function (response) {

            // Display message
			notificationService.success(response.message);

            // Go to home page
            $location.path("/login");

        }, function errorHandler (error) {
            // Display an error
            $scope.message = error.message;
        });
    }

    this.validateToken = function (token) {

        // Validate token
        UserService.validateToken(token).then( function(response) {

            $scope.success = response.success

            if(!$scope.success) {
                // Hide the fields and button
                // Dispaly the error message
                $scope.message = response.message;
            }

        }, function errorHandler (error) {
            // Display an error
            $scope.message = error.message;
        });

    }
};